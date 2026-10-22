import React from 'react';
import { FinancialTransaction, ChurchProfile, Member } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, Printer, ShieldCheck, Church } from 'lucide-react';

interface ReceiptModalProps {
  transaction: FinancialTransaction | null;
  churchProfile: ChurchProfile;
  member?: Member | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  churchProfile,
  member,
  onClose,
}) => {
  const { theme } = useChurch();
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">Comprovante de Contribuição Eclesiástica</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 md:p-8 bg-slate-50 flex justify-center">
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-sm w-full space-y-4 text-xs font-serif printable-receipt">
            <div className="text-center border-b border-slate-200 pb-3">
              <h4 className="font-bold text-sm tracking-wide text-slate-900 uppercase">{churchProfile.name}</h4>
              <p className="text-[10px] text-slate-500 font-sans">CNPJ: {churchProfile.cnpj} • {churchProfile.address}</p>
              <p className="text-[10px] text-slate-500 font-sans">{churchProfile.cityState}</p>
            </div>

            <div className="flex items-center justify-between font-sans text-xs pt-1">
              <span className="font-mono text-slate-500">RECIBO Nº: {transaction.receiptNumber || 'REC-2026-AUTO'}</span>
              <span className="font-bold text-emerald-700 text-sm">{formatCurrency(transaction.amount)}</span>
            </div>

            <div className="font-sans text-xs space-y-2 text-slate-700 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
              <p>
                Recebemos de <strong>{member?.name || transaction.description || 'Doador Anônimo'}</strong> a quantia de{' '}
                <strong>{formatCurrency(transaction.amount)}</strong>, referente a <strong>{transaction.category.toUpperCase().replace('_', ' ')}</strong>.
              </p>
              <p className="text-[11px] text-slate-500 italic">
                Forma de Pagamento: {transaction.paymentMethod.toUpperCase()} • Data: {formatDate(transaction.date)}
              </p>
            </div>

            <p className="font-sans text-[10px] text-slate-400 italic text-center">
              "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria." (2 Coríntios 9:7)
            </p>

            <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-center font-sans text-[11px]">
              <div>
                <div className="border-b border-slate-300 mb-1"></div>
                <p className="font-bold text-slate-800">{churchProfile.treasurerName}</p>
                <p className="text-[9px] text-slate-400">Tesouraria Geral</p>
              </div>
              <div>
                <div className="border-b border-slate-300 mb-1"></div>
                <p className="font-bold text-slate-800">{churchProfile.seniorPastor}</p>
                <p className="text-[9px] text-slate-400">Pastor Presidente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Fechar
          </button>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: theme.primaryHex,
              color: theme.id === 'dourado_real' ? '#020617' : '#ffffff'
            }}
            className="flex items-center gap-1.5 px-4 py-2 font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer hover:opacity-90"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Recibo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
