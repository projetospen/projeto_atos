import React, { useState, useMemo } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { FinancialTransaction } from '../../types';
import { TransactionFormModal } from './TransactionFormModal';
import { ReceiptModal } from './ReceiptModal';
import { 
  CircleDollarSign, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt, 
  Printer, 
  Trash2, 
  Search, 
  Filter, 
  ShieldCheck, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react';

export const FinancesView: React.FC = () => {
  const { transactions, deleteTransaction, members, churchProfile, theme } = useChurch();

  const [filterType, setFilterType] = useState<'all' | 'entrada' | 'saida'>('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<FinancialTransaction | null>(null);

  // Financial metrics
  const totalIncome = transactions
    .filter(t => t.type === 'entrada')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'saida')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalTithes = transactions
    .filter(t => t.category === 'dizimo')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filterType === 'all' || t.type === filterType;
      const searchMatch = !search.trim() || 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        (t.receiptNumber && t.receiptNumber.toLowerCase().includes(search.toLowerCase()));

      return typeMatch && searchMatch;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filterType, search]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      deleteTransaction(id);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'dizimo': return 'Dízimo Fiel';
      case 'oferta_geral': return 'Oferta de Culto';
      case 'oferta_missoes': return 'Oferta Missionária';
      case 'campanha_construcao': return 'Campanha Reforma';
      case 'energia_eletrica': return 'Energia Elétrica';
      case 'agua': return 'Água & Saneamento';
      case 'aluguel': return 'Aluguel do Templo';
      case 'manutencao_templo': return 'Manutenção';
      case 'ajuda_custo_pastoral': return 'Ajuda Pastoral';
      case 'missoes_envio': return 'Sustento Missionário';
      case 'material_ebd': return 'Material EBD';
      default: return category.replace(/_/g, ' ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CircleDollarSign className="w-5 h-5" style={{ color: theme.primaryHex }} />
            <span>Tesouraria & Livro Caixa Eclesiástico</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Controle de dízimos, ofertas nominativas, despesas correntes do templo e emissão de recibos
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          style={{ backgroundColor: theme.primaryHex }}
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
            <span>Total Entradas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatCurrency(totalIncome)}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Dízimos e ofertas do mês</span>
        </div>

        {/* Total Expense */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
            <span>Total Saídas</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">{formatCurrency(totalExpense)}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Contas fixas, aluguel e missões</span>
        </div>

        {/* Net Cash Balance */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
            <span>Saldo Líquido</span>
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${theme.primaryHex}15`, color: theme.primaryHex }}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className={`mt-2 text-2xl font-black ${netBalance >= 0 ? 'text-slate-800 dark:text-white' : 'text-rose-600 dark:text-rose-400'}`}>
            {formatCurrency(netBalance)}
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Disponibilidade atual em conta</span>
        </div>

        {/* Tithes Total */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">
            <span>Dízimos do Mês</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-amber-700 dark:text-amber-400">{formatCurrency(totalTithes)}</p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">Fidelidade dos membros</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por descrição, número do recibo ou categoria..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-800 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'all' 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('entrada')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'entrada' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilterType('saida')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              filterType === 'saida' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Saídas
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-3">Tipo / Categoria</th>
                <th className="py-3 px-3">Histórico / Membro</th>
                <th className="py-3 px-3">Pagamento</th>
                <th className="py-3 px-3 text-right">Valor</th>
                <th className="py-3 px-4 text-right">Recibo / Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map(tx => {
                const member = members.find(m => m.id === tx.memberId);
                const isIncome = tx.type === 'entrada';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                      {formatDate(tx.date)}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isIncome ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-semibold text-slate-800 dark:text-white capitalize">
                          {getCategoryLabel(tx.category)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-800 dark:text-white">{tx.description}</p>
                      {member && (
                        <p 
                          className="text-[11px] font-medium"
                          style={{ color: theme.primaryHex }}
                        >
                          Membro: {member.name}
                        </p>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded uppercase font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.paymentMethod}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-sm">
                      <span className={isIncome ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTxForReceipt(tx)}
                          className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg cursor-pointer"
                          title="Emitir Recibo Oficial"
                        >
                          <Receipt className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          <span>Recibo</span>
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                          title="Excluir lançamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <TransactionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <ReceiptModal
        transaction={selectedTxForReceipt}
        churchProfile={churchProfile}
        member={selectedTxForReceipt?.memberId ? members.find(m => m.id === selectedTxForReceipt.memberId) : null}
        onClose={() => setSelectedTxForReceipt(null)}
      />
    </div>
  );
};
