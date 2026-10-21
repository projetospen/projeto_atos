import React from 'react';
import { Member } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { 
  X, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Church, 
  ShieldCheck, 
  Droplet, 
  Heart, 
  MessageCircle, 
  Edit3, 
  Trash2,
  Users
} from 'lucide-react';

interface MemberDetailsModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
}

export const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  member,
  onClose,
  onEdit,
}) => {
  const { deleteMember, departments, setSelectedMemberForCard, churchProfile } = useChurch();

  if (!member) return null;

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${member.name}? Esta ação não pode ser desfeita.`)) {
      deleteMember(member.id);
      onClose();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Não informado';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const cleanPhone = member.phone.replace(/\D/g, '');
  const whatsappMsg = encodeURIComponent(
    `A paz do Senhor, ${member.name}! Aqui é da secretaria da ${churchProfile.name}.`
  );

  const memberDepartments = departments.filter(d => member.departmentIds?.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6">
        {/* Header Profile Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-lg bg-slate-800 shrink-0">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-900 font-bold text-2xl text-amber-300">
                  {member.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                  {member.role}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  member.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {member.status.toUpperCase()}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white truncate">{member.name}</h2>
              <p className="text-xs text-slate-300 flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <span>Membro desde {formatDate(member.membershipDate)}</span>
                <span>•</span>
                <span>{churchProfile.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMemberForCard(member)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Ver Carteirinha</span>
            </button>
            <a
              href={`https://wa.me/55${cleanPhone}?text=${whatsappMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(member);
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Editar</span>
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Excluir cadastro"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto text-xs">
          {/* Dados Eclesiásticos */}
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Church className="w-4 h-4 text-indigo-600" />
              <span>Vida Eclesiástica & Ministérios</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batismo em Águas</span>
                <p className="font-semibold text-slate-800">
                  {member.isBaptizedWater ? `Sim (${formatDate(member.waterBaptismDate)})` : 'Não Batizado'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batismo no Espírito Santo</span>
                <p className="font-semibold text-slate-800">
                  {member.isBaptizedHolySpirit ? 'Sim' : 'Não informado'}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Igreja Anterior</span>
                <p className="font-semibold text-slate-800 truncate">
                  {member.previousChurch || 'Nenhuma / Primeira igreja'}
                </p>
              </div>
            </div>

            {/* Departamentos */}
            <div className="mt-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                Ministérios Vinculados:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {memberDepartments.length > 0 ? (
                  memberDepartments.map(d => (
                    <span key={d.id} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-medium">
                      {d.name}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">Nenhum departamento vinculado.</span>
                )}
              </div>
            </div>
          </div>

          {/* Dados Pessoais & Contato */}
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-indigo-600" />
              <span>Contato & Endereço</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Telefone</span>
                <p className="font-semibold text-slate-800">{member.phone}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">E-mail</span>
                <p className="font-semibold text-slate-800 truncate">{member.email}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Endereço Completo</span>
                <p className="font-semibold text-slate-800">
                  {member.address ? `${member.address}, ${member.neighborhood} - ${member.city}/${member.state}` : 'Não cadastrado'}
                </p>
              </div>
            </div>
          </div>

          {/* Dados Civis */}
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-indigo-600" />
              <span>Dados Civis & Família</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nascimento</span>
                <p className="font-semibold text-slate-800">{formatDate(member.birthDate)}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estado Civil</span>
                <p className="font-semibold text-slate-800 capitalize">{member.maritalStatus}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cônjuge</span>
                <p className="font-semibold text-slate-800 truncate">{member.spouseName || '-'}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Qtd. Filhos</span>
                <p className="font-semibold text-slate-800">{member.childrenCount ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Observações Pastorais */}
          {member.notes && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
              <span className="text-[10px] text-amber-800 font-bold uppercase block mb-1">
                Anotações da Secretaria / Pastoral:
              </span>
              <p className="text-slate-700 leading-relaxed italic">{member.notes}</p>
            </div>
          )}

          {/* Contato de Emergência */}
          {member.emergencyContact && (
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Contato de Emergência</span>
                <p className="font-semibold text-slate-800">
                  {member.emergencyContact.name} ({member.emergencyContact.relationship})
                </p>
              </div>
              <span className="font-mono text-indigo-600 font-semibold">{member.emergencyContact.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
