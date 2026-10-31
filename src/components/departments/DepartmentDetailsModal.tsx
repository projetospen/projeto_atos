import React, { useState, useEffect } from 'react';
import { Department, FinancialTransaction, TransactionCategory } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { 
  X, 
  Building2, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Target, 
  Edit3, 
  Trash2, 
  MessageCircle, 
  CreditCard, 
  Wallet, 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';

interface DepartmentDetailsModalProps {
  department: Department | null;
  onClose: () => void;
  onEdit?: (dept: Department) => void;
}

export const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({
  department,
  onClose,
  onEdit,
}) => {
  const { 
    members, 
    deleteDepartment, 
    setSelectedMemberForCard, 
    theme, 
    transactions, 
    addTransaction, 
    deleteTransaction,
    currentUser,
    adminRole
  } = useChurch();

  const [activeTab, setActiveTab] = useState<'visao_geral' | 'caixa'>('caixa');
  const [isAddingTx, setIsAddingTx] = useState(false);
  const [txType, setTxType] = useState<'saida' | 'entrada'>('saida');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txCategory, setTxCategory] = useState<TransactionCategory>('despesa_departamento');
  const [txPaymentMethod, setTxPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao' | 'transferencia' | 'boleto'>('pix');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (department) {
      setActiveTab('caixa');
      setIsAddingTx(false);
      setSuccessMessage(null);
    }
  }, [department]);

  if (!department) return null;

  const leader = members.find(m => m.id === department.leaderMemberId);
  const viceLeader = members.find(m => m.id === department.viceLeaderMemberId);
  const deptMembers = members.filter(m => m.departmentIds?.includes(department.id));

  // Financial calculations for department cash box
  const initialCash = department.initialCash ?? department.monthlyBudget ?? 0;
  const deptTransactions = transactions
    .filter(t => t.departmentId === department.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalEntries = deptTransactions
    .filter(t => t.type === 'entrada')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = deptTransactions
    .filter(t => t.type === 'saida')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = initialCash + totalEntries - totalExpenses;

  const formatCurrency = (val?: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o departamento ${department.name}?`)) {
      deleteDepartment(department.id);
      onClose();
    }
  };

  const handleOpenAddTx = (type: 'saida' | 'entrada') => {
    setTxType(type);
    setTxCategory(type === 'saida' ? 'despesa_departamento' : 'verba_departamento');
    setTxAmount('');
    setTxDescription('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setIsAddingTx(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(txAmount);
    if (!numAmount || numAmount <= 0) {
      alert('Por favor, informe um valor válido maior que zero.');
      return;
    }

    if (!txDescription.trim()) {
      alert('Por favor, descreva a finalidade do gasto ou entrada.');
      return;
    }

    const receiptNum = `REC-DEP-${Math.floor(1000 + Math.random() * 9000)}`;

    addTransaction({
      type: txType,
      category: txCategory,
      amount: numAmount,
      description: txDescription.trim(),
      departmentId: department.id,
      date: txDate,
      paymentMethod: txPaymentMethod,
      receiptNumber: receiptNum,
      createdBy: currentUser?.name || adminRole,
    });

    setIsAddingTx(false);
    setSuccessMessage(
      txType === 'saida'
        ? `Gasto de ${formatCurrency(numAmount)} registrado no caixa!`
        : `Entrada de ${formatCurrency(numAmount)} adicionada ao caixa!`
    );
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleDeleteTx = (id: string) => {
    if (window.confirm('Deseja estornar/excluir este lançamento do caixa do departamento?')) {
      deleteTransaction(id);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'despesa_departamento': return 'Despesa do Departamento';
      case 'verba_departamento': return 'Entrada / Verba Repassada';
      case 'material_ebd': return 'Material Didático';
      case 'equipamentos_som_multimidia': return 'Equipamentos / Som / Mídia';
      case 'cantina_eventos': return 'Lanches & Eventos';
      case 'manutencao_templo': return 'Manutenção / Reparo';
      case 'acao_social_cestas': return 'Ação Social';
      case 'oferta_missoes': return 'Oferta Missionária';
      default: return category.replace(/_/g, ' ');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Banner with Department Theme */}
        <div className={`p-6 bg-gradient-to-r ${department.color} text-white relative shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-black/20 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-md shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Ministério Eclesiástico</span>
              <h2 className="text-xl font-extrabold text-white leading-tight">{department.name}</h2>
            </div>
          </div>
          <p className="text-xs text-white/90 leading-relaxed max-w-xl line-clamp-2">
            {department.description}
          </p>
        </div>

        {/* Action Bar & Quick Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Tabs */}
          <div className="flex items-center p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('caixa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'caixa'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Caixa do Departamento</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                currentBalance >= 0 ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200' : 'bg-rose-200 text-rose-900'
              }`}>
                {formatCurrency(currentBalance)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visao_geral')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visao_geral'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Equipe & Metas ({deptMembers.length})</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
              title="Excluir departamento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto flex-1">
          {/* Success Feedback Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between text-xs animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold">{successMessage}</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: CAIXA DO DEPARTAMENTO & CONTROLE DE GASTOS                          */}
          {/* ========================================================================= */}
          {activeTab === 'caixa' && (
            <div className="space-y-5">
              {/* Top Financial Dashboard for the Department */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Saldo Atual em Caixa */}
                <div className={`p-4 rounded-2xl border ${
                  currentBalance >= 0 
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80' 
                    : 'bg-rose-50/70 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80'
                } space-y-1`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Saldo em Caixa</span>
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      currentBalance >= 0 
                        ? 'bg-emerald-200/80 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300' 
                        : 'bg-rose-200/80 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                    }`}>
                      {currentBalance >= 0 ? 'Disponível' : 'Déficit'}
                    </span>
                  </div>
                  <p className={`text-xl font-black ${
                    currentBalance >= 0 
                      ? 'text-emerald-700 dark:text-emerald-300' 
                      : 'text-rose-700 dark:text-rose-300'
                  }`}>
                    {formatCurrency(currentBalance)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Controle de saldo em tempo real
                  </p>
                </div>

                {/* 2. Total de Gastos Realizados */}
                <div className="p-4 rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/30 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Gastos / Saídas</span>
                    </span>
                    <span className="text-[9px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/40 px-1.5 py-0.5 rounded">
                      {deptTransactions.filter(t => t.type === 'saida').length} despesas
                    </span>
                  </div>
                  <p className="text-xl font-black text-rose-700 dark:text-rose-400">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Despesas pagas pelo departamento
                  </p>
                </div>

                {/* 3. Fundo Base & Entradas */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Fundo + Entradas</span>
                    </span>
                  </div>
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    {formatCurrency(initialCash + totalEntries)}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Base: {formatCurrency(initialCash)} {totalEntries > 0 ? `+ Entradas: ${formatCurrency(totalEntries)}` : ''}
                  </p>
                </div>
              </div>

              {/* Action Buttons to Add Expense or Entry */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs">
                    Movimentações do Caixa de {department.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Lance despesas e verbas para manter a prestação de contas organizada
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOpenAddTx('saida')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>Lançar Gasto / Despesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenAddTx('entrada')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Adicionar Verba / Entrada</span>
                  </button>
                </div>
              </div>

              {/* Inline Form to Register Transaction */}
              {isAddingTx && (
                <form 
                  onSubmit={handleSaveTransaction} 
                  className={`p-4 rounded-2xl border ${
                    txType === 'saida'
                      ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                      : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                  } space-y-3.5 animate-in fade-in duration-200 shadow-xs`}
                >
                  <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-xs flex items-center gap-1.5 text-slate-800 dark:text-white">
                      {txType === 'saida' ? (
                        <>
                          <ArrowDownRight className="w-4 h-4 text-rose-600" />
                          <span>Registrar Novo Gasto / Despesa do Departamento</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                          <span>Adicionar Entrada de Verba no Caixa</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingTx(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Descrição do Lançamento *
                      </label>
                      <input
                        type="text"
                        required
                        value={txDescription}
                        onChange={e => setTxDescription(e.target.value)}
                        placeholder={txType === 'saida' ? 'Ex: Compra de 4 cabos XLR e suportes de partitura' : 'Ex: Repasse mensal da tesouraria geral da igreja'}
                        className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Valor (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={txAmount}
                        onChange={e => setTxAmount(e.target.value)}
                        placeholder="0,00"
                        className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Categoria
                      </label>
                      <select
                        value={txCategory}
                        onChange={e => setTxCategory(e.target.value as TransactionCategory)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
                      >
                        {txType === 'saida' ? (
                          <>
                            <option value="despesa_departamento">Despesa Geral do Departamento</option>
                            <option value="equipamentos_som_multimidia">Equipamentos / Som / Mídia</option>
                            <option value="material_ebd">Materiais Didáticos / EBD / Kids</option>
                            <option value="cantina_eventos">Lanches, Café & Eventos</option>
                            <option value="manutencao_templo">Manutenção & Reparos</option>
                            <option value="acao_social_cestas">Ação Social / Ajuda</option>
                            <option value="outros">Outros Gastos</option>
                          </>
                        ) : (
                          <>
                            <option value="verba_departamento">Verba / Repasse da Igreja</option>
                            <option value="cantina_eventos">Arrecadação / Eventos / Vendas</option>
                            <option value="oferta_missoes">Doações e Ofertas ao Ministério</option>
                            <option value="outros">Outras Entradas</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Data
                      </label>
                      <input
                        type="date"
                        required
                        value={txDate}
                        onChange={e => setTxDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                        Forma de Pagamento
                      </label>
                      <select
                        value={txPaymentMethod}
                        onChange={e => setTxPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-hidden"
                      >
                        <option value="pix">PIX</option>
                        <option value="dinheiro">Dinheiro em Espécie</option>
                        <option value="cartao">Cartão</option>
                        <option value="transferencia">Transferência Bancária</option>
                        <option value="boleto">Boleto</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setIsAddingTx(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs cursor-pointer ${
                        txType === 'saida' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      Confirmar Lançamento no Caixa
                    </button>
                  </div>
                </form>
              )}

              {/* Transactions History Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Histórico de Gastos & Movimentações ({deptTransactions.length})
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Ordenado por data recente
                  </span>
                </div>

                {deptTransactions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 space-y-2">
                    <Wallet className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                      Nenhum gasto ou movimentação registrado para este departamento ainda.
                    </p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Utilize o botão acima para lançar os gastos e compras efetuadas para manter o controle total do caixa ministerial.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3 pl-4">Tipo & Data</th>
                          <th className="p-3">Descrição / Finalidade</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Forma</th>
                          <th className="p-3 text-right">Valor</th>
                          <th className="p-3 pr-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                        {deptTransactions.map(tx => {
                          const isExpense = tx.type === 'saida';
                          return (
                            <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-3 pl-4 whitespace-nowrap">
                                <div className="flex items-center gap-1.5">
                                  {isExpense ? (
                                    <span className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 shrink-0">
                                      <ArrowDownRight className="w-3.5 h-3.5" />
                                    </span>
                                  ) : (
                                    <span className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0">
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                  <div>
                                    <span className={`text-[10px] font-bold block ${isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                      {isExpense ? 'Gasto' : 'Entrada'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {formatDate(tx.date)}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3">
                                <p className="font-semibold text-slate-800 dark:text-white text-xs">
                                  {tx.description}
                                </p>
                                {tx.receiptNumber && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {tx.receiptNumber}
                                  </span>
                                )}
                              </td>

                              <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-300 text-[11px]">
                                {getCategoryLabel(tx.category)}
                              </td>

                              <td className="p-3 whitespace-nowrap text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">
                                {tx.paymentMethod}
                              </td>

                              <td className="p-3 text-right whitespace-nowrap font-bold text-xs">
                                <span className={isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>
                                  {isExpense ? '-' : '+'} {formatCurrency(tx.amount)}
                                </span>
                              </td>

                              <td className="p-3 pr-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTx(tx.id)}
                                  title="Excluir / Estornar lançamento"
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: VISÃO GERAL, LIDERANÇA & EQUIPE                                    */}
          {/* ========================================================================= */}
          {activeTab === 'visao_geral' && (
            <div className="space-y-5">
              {/* Quick Caixa Summary Banner */}
              <div 
                onClick={() => setActiveTab('caixa')}
                className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/40 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-xs">
                      Caixa do Departamento: <span className="text-emerald-700 dark:text-emerald-400">{formatCurrency(currentBalance)}</span>
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Gastos realizados: {formatCurrency(totalExpenses)} • Clique para abrir o controle de gastos completo
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-200/70 dark:bg-emerald-900/60 rounded-lg">
                  Ver Caixa
                </span>
              </div>

              {/* Liderança Responsável */}
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-[11px]">
                  Liderança do Ministério
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {leader ? (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                          {leader.photoUrl ? (
                            <img src={leader.photoUrl} alt={leader.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-200">
                              {leader.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{leader.name}</p>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold block">Líder Titular</span>
                          <span className="text-[10px] text-slate-500">{leader.phone}</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/55${leader.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400">Líder não atribuído</div>
                  )}

                  {viceLeader ? (
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                          {viceLeader.photoUrl ? (
                            <img src={viceLeader.photoUrl} alt={viceLeader.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 dark:text-slate-200">
                              {viceLeader.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{viceLeader.name}</p>
                          <span className="text-[10px] font-semibold block" style={{ color: theme.primaryHex }}>Vice-Líder / Auxiliar</span>
                          <span className="text-[10px] text-slate-500">{viceLeader.phone}</span>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/55${viceLeader.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Agenda & Local */}
              {(department.meetingSchedule || department.meetingLocation) && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {department.meetingSchedule && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" style={{ color: theme.primaryHex }} />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Encontros & Ensaios</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{department.meetingSchedule}</span>
                      </div>
                    </div>
                  )}
                  {department.meetingLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.primaryHex }} />
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Local de Reunião</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{department.meetingLocation}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Metas do Ministério */}
              {department.goals && department.goals.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px]">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>Metas & Objetivos do Ano</span>
                  </h4>
                  <div className="space-y-1.5">
                    {department.goals.map((g, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-tight">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de Membros do Departamento */}
              <div>
                <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 text-[11px]">
                  <Users className="w-4 h-4" style={{ color: theme.primaryHex }} />
                  <span>Equipe de Voluntários ({deptMembers.length})</span>
                </h4>
                {deptMembers.length === 0 ? (
                  <p className="text-slate-400 italic">Nenhum membro vinculado a este ministério ainda.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {deptMembers.map(m => (
                      <div 
                        key={m.id}
                        className="p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 flex items-center justify-between bg-white dark:bg-slate-800/80"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{m.name}</p>
                            <p className="text-[10px] text-slate-400">{m.role}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedMemberForCard(m)}
                          title="Ver Carteirinha"
                          className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
