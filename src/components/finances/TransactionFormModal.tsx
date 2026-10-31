import React, { useState } from 'react';
import { FinancialTransaction, TransactionCategory, TransactionType } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, DollarSign, Save } from 'lucide-react';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addTransaction, members, departments, adminRole, theme } = useChurch();

  const [type, setType] = useState<TransactionType>('entrada');
  const [category, setCategory] = useState<TransactionCategory>('dizimo');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [date, setDate] = useState<string>('2026-10-20');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'dinheiro' | 'cartao' | 'transferencia' | 'boleto'>('pix');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    const receiptNum = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    addTransaction({
      type,
      category,
      amount: numAmount,
      description: description.trim() || (type === 'entrada' ? 'Contribuição eclesiástica' : 'Despesa operacional'),
      memberId: memberId || undefined,
      departmentId: departmentId || undefined,
      date,
      paymentMethod,
      receiptNumber: receiptNum,
      createdBy: adminRole,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">Lançamento de Tesouraria</h3>
            <p className="text-xs text-slate-500">Registre dízimos, ofertas congregacionais ou despesas da igreja</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('entrada');
                setCategory('dizimo');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'entrada' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              + Entrada (Dízimo / Oferta)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('saida');
                setCategory('energia_eletrica');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'saida' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              - Saída (Despesa / Conta)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Categoria *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              >
                {type === 'entrada' ? (
                  <>
                    <option value="dizimo">Dízimo Fiel</option>
                    <option value="oferta_geral">Oferta Geral de Culto</option>
                    <option value="oferta_missoes">Oferta Missionária</option>
                    <option value="campanha_construcao">Campanha de Construção / Reforma</option>
                    <option value="cantina_eventos">Cantina & Eventos</option>
                    <option value="verba_departamento">Aporte / Verba para Caixa de Departamento</option>
                    <option value="outros">Outras Entradas</option>
                  </>
                ) : (
                  <>
                    <option value="energia_eletrica">Energia Elétrica</option>
                    <option value="agua">Água & Saneamento</option>
                    <option value="aluguel">Aluguel do Templo</option>
                    <option value="manutencao_templo">Manutenção & Conservação</option>
                    <option value="ajuda_custo_pastoral">Ajuda de Custo Pastoral</option>
                    <option value="missoes_envio">Sustento Missionário</option>
                    <option value="material_ebd">Material Didático EBD / Kids</option>
                    <option value="equipamentos_som_multimidia">Equipamentos Som / Multimídia</option>
                    <option value="acao_social_cestas">Ação Social & Cestas Básicas</option>
                    <option value="despesa_departamento">Gasto / Despesa de Departamento</option>
                    <option value="outros">Outras Despesas</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Valor (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full px-3 py-2 text-sm font-bold text-slate-800 border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          {/* Department Cash Box linkage */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Vincular ao Caixa do Departamento (Opcional)
            </label>
            <select
              value={departmentId}
              onChange={e => setDepartmentId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden text-slate-700 bg-white"
            >
              <option value="">Nenhum (Movimentação Geral da Igreja)</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            {departmentId && (
              <p className="text-[11px] text-blue-600 mt-1">
                ℹ️ Este lançamento atualizará em tempo real o saldo e histórico do Caixa de {departments.find(d => d.id === departmentId)?.name}.
              </p>
            )}
          </div>

          {type === 'entrada' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Membro Contribuinte (Opcional)</label>
              <select
                value={memberId}
                onChange={e => setMemberId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden text-slate-700"
              >
                <option value="">Anônimo / Congregacional</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              >
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro Espécie</option>
                <option value="cartao">Cartão Débito/Crédito</option>
                <option value="transferencia">Transferência / TED</option>
                <option value="boleto">Boleto Bancário</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Data *</label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Descrição / Histórico</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Ex: Dízimo mês de outubro ou Reparo do refletor do púlpito"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: theme.primaryHex,
                color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer hover:opacity-90"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Lançamento</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
