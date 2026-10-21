import React, { useRef } from 'react';
import { Member, ChurchProfile } from '../../types';
import { X, Printer, Download, QrCode, CheckCircle2, ShieldCheck, Church, Sparkles } from 'lucide-react';

interface MemberCardModalProps {
  member: Member | null;
  churchProfile: ChurchProfile;
  onClose: () => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({
  member,
  churchProfile,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!member) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format dates
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Não informado';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getValidityDate = (membershipDate: string) => {
    const year = parseInt(membershipDate.split('-')[0]) || 2026;
    return `31/12/${Math.max(year + 3, 2027)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">Carteirinha Eclesiástica de Membro</h3>
              <p className="text-xs text-slate-500">Documento oficial de identificação comunitária</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Preview Container */}
        <div className="p-6 md:p-8 bg-slate-100 flex flex-col items-center justify-center">
          <div 
            ref={cardRef}
            className="printable-card w-full max-w-[480px] bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden"
          >
            {/* Background Seal / Watermark */}
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
              <Church className="w-72 h-72 text-white" />
            </div>

            {/* Top Accent Bar */}
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-serif font-black shadow-md">
                  <Church className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-wide text-amber-200 leading-tight">
                    {churchProfile.name}
                  </h4>
                  <p className="text-[10px] text-slate-300 font-mono tracking-wider">
                    CREDENCIAL ECLESIÁSTICA OFICIAL
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                REG: {member.id.replace('mem-', 'ATOS-')}
              </span>
            </div>

            {/* Body Info */}
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Photo Area */}
              <div className="col-span-4 flex flex-col items-center">
                <div className="w-24 h-28 rounded-xl overflow-hidden border-2 border-amber-400/70 shadow-lg bg-slate-800 relative">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-900/50 text-amber-200">
                      <span className="text-2xl font-bold">{member.name.charAt(0)}</span>
                      <span className="text-[9px] text-slate-400 mt-1">SEM FOTO</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 py-0.5 text-center">
                    <span className="text-[9px] font-semibold text-amber-300 capitalize">{member.status}</span>
                  </div>
                </div>
              </div>

              {/* Data Fields */}
              <div className="col-span-8 space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nome do Membro</span>
                  <p className="font-bold text-sm text-slate-100 leading-tight">{member.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Cargo / Ministério</span>
                    <p className="font-semibold text-amber-300 text-[11px] truncate">{member.role}</p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Membro Desde</span>
                    <p className="font-medium text-slate-200 text-[11px]">{formatDate(member.membershipDate)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Batismo em Águas</span>
                    <p className="font-medium text-slate-200 text-[11px]">
                      {member.isBaptizedWater ? formatDate(member.waterBaptismDate) : 'Não'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block">Nascimento</span>
                    <p className="font-medium text-slate-200 text-[11px]">{formatDate(member.birthDate)}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Congregação / Cidade</span>
                  <p className="font-medium text-slate-200 text-[11px] truncate">{churchProfile.cityState}</p>
                </div>
              </div>
            </div>

            {/* Footer / QR Code / Signatures */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded p-1 flex items-center justify-center text-slate-900 shadow">
                  <QrCode className="w-8 h-8" />
                </div>
                <div className="text-slate-400 text-[9px] leading-tight">
                  <p className="text-slate-200 font-medium">Autenticidade Digital</p>
                  <p>Validade: {getValidityDate(member.membershipDate)}</p>
                  <p>CNPJ: {churchProfile.cnpj}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="w-28 border-b border-amber-300/40 mb-0.5"></div>
                <p className="font-serif italic text-amber-200 text-[10px] leading-none">{churchProfile.seniorPastor}</p>
                <p className="text-[8px] text-slate-400">Pastor Presidente</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4 text-center max-w-sm">
            Esta credencial certifica que o titular é membro regular em plena comunhão com a congregação.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Pronto para impressão em formato padrão de credencial</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Carteirinha</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
