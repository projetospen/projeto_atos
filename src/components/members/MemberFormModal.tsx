import React, { useState } from 'react';
import { Member, MemberStatus, MaritalStatus, MinistryRole } from '../../types';
import { useChurch } from '../../context/ChurchContext';
import { X, User, Phone, MapPin, Church, Heart, Save, AlertCircle } from 'lucide-react';

interface MemberFormModalProps {
  member?: Member | null; // If provided, edit mode
  isOpen: boolean;
  onClose: () => void;
}

export const MemberFormModal: React.FC<MemberFormModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { addMember, updateMember, departments, theme } = useChurch();

  const [activeSection, setActiveSection] = useState<'pessoal' | 'contato' | 'eclesiastico' | 'observacoes'>('pessoal');

  // Form State
  const [formData, setFormData] = useState({
    name: member?.name || '',
    cpf: member?.cpf || '',
    rg: member?.rg || '',
    email: member?.email || '',
    phone: member?.phone || '',
    photoUrl: member?.photoUrl || '',
    birthDate: member?.birthDate || '1995-01-01',
    gender: (member?.gender || 'masculino') as 'masculino' | 'feminino',
    maritalStatus: (member?.maritalStatus || 'solteiro') as MaritalStatus,
    spouseName: member?.spouseName || '',
    childrenCount: member?.childrenCount ?? 0,
    address: member?.address || '',
    neighborhood: member?.neighborhood || '',
    city: member?.city || 'São Paulo',
    state: member?.state || 'SP',
    zipCode: member?.zipCode || '',
    status: (member?.status || 'ativo') as MemberStatus,
    role: (member?.role || 'Membro') as MinistryRole,
    isBaptizedWater: member?.isBaptizedWater ?? true,
    waterBaptismDate: member?.waterBaptismDate || '',
    isBaptizedHolySpirit: member?.isBaptizedHolySpirit ?? false,
    membershipDate: member?.membershipDate || new Date().toISOString().split('T')[0],
    previousChurch: member?.previousChurch || '',
    departmentIds: member?.departmentIds || [],
    notes: member?.notes || '',
    emergencyName: member?.emergencyContact?.name || '',
    emergencyPhone: member?.emergencyContact?.phone || '',
    emergencyRel: member?.emergencyContact?.relationship || '',
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDepartmentToggle = (deptId: string) => {
    setFormData(prev => {
      const exists = prev.departmentIds.includes(deptId);
      if (exists) {
        return { ...prev, departmentIds: prev.departmentIds.filter(id => id !== deptId) };
      } else {
        return { ...prev, departmentIds: [...prev.departmentIds, deptId] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('O nome completo do membro é obrigatório.');
      setActiveSection('pessoal');
      return;
    }
    if (!formData.phone.trim()) {
      setError('O telefone de contato é obrigatório para notificações e escalas.');
      setActiveSection('contato');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      cpf: formData.cpf.trim() || undefined,
      rg: formData.rg.trim() || undefined,
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: formData.phone.trim(),
      photoUrl: formData.photoUrl.trim() || undefined,
      birthDate: formData.birthDate,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,
      spouseName: formData.spouseName.trim() || undefined,
      childrenCount: Number(formData.childrenCount),
      address: formData.address.trim(),
      neighborhood: formData.neighborhood.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim() || undefined,
      status: formData.status,
      role: formData.role,
      isBaptizedWater: formData.isBaptizedWater,
      waterBaptismDate: formData.isBaptizedWater ? formData.waterBaptismDate : undefined,
      isBaptizedHolySpirit: formData.isBaptizedHolySpirit,
      membershipDate: formData.membershipDate,
      previousChurch: formData.previousChurch.trim() || undefined,
      departmentIds: formData.departmentIds,
      notes: formData.notes.trim() || undefined,
      emergencyContact: formData.emergencyName.trim() ? {
        name: formData.emergencyName.trim(),
        phone: formData.emergencyPhone.trim(),
        relationship: formData.emergencyRel.trim() || 'Familiar'
      } : undefined
    };

    if (member) {
      updateMember(member.id, payload);
    } else {
      addMember(payload);
    }

    onClose();
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&fit=crop&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">
              {member ? 'Editar Cadastro de Membro' : 'Novo Cadastro de Membro / Congregado'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Preencha os dados eclesiásticos, civis e de contato para a secretaria da igreja
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSection('pessoal')}
            style={activeSection === 'pessoal' ? { borderBottomColor: theme.primaryHex, color: theme.primaryHex } : undefined}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
              activeSection === 'pessoal' 
                ? 'border-current font-bold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Dados Pessoais</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('contato')}
            style={activeSection === 'contato' ? { borderBottomColor: theme.primaryHex, color: theme.primaryHex } : undefined}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
              activeSection === 'contato' 
                ? 'border-current font-bold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>2. Contato & Endereço</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('eclesiastico')}
            style={activeSection === 'eclesiastico' ? { borderBottomColor: theme.primaryHex, color: theme.primaryHex } : undefined}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
              activeSection === 'eclesiastico' 
                ? 'border-current font-bold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Church className="w-4 h-4" />
            <span>3. Vida Eclesiástica</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('observacoes')}
            style={activeSection === 'observacoes' ? { borderBottomColor: theme.primaryHex, color: theme.primaryHex } : undefined}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
              activeSection === 'observacoes' 
                ? 'border-current font-bold' 
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>4. Pastoral & Emergência</span>
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* SECTION 1: DADOS PESSOAIS */}
          {activeSection === 'pessoal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: João da Silva Santos"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sexo</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado Civil</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as MaritalStatus })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="solteiro">Solteiro(a)</option>
                    <option value="casado">Casado(a)</option>
                    <option value="viuvo">Viúvo(a)</option>
                    <option value="divorciado">Divorciado(a)</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qtd. de Filhos</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.childrenCount}
                    onChange={e => setFormData({ ...formData, childrenCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {formData.maritalStatus === 'casado' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cônjuge</label>
                  <input
                    type="text"
                    value={formData.spouseName}
                    onChange={e => setFormData({ ...formData, spouseName: e.target.value })}
                    placeholder="Nome do esposo(a)"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF (Opcional)</label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">RG (Opcional)</label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={e => setFormData({ ...formData, rg: e.target.value })}
                    placeholder="00.000.000-0"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Foto de Perfil (URL da Imagem)
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={e => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Sugestões rápidas de fotos:</span>
                  <div className="flex gap-1.5">
                    {sampleAvatars.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, photoUrl: url })}
                        className="w-6 h-6 rounded-full overflow-hidden border border-slate-300 hover:scale-110 transition-transform"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CONTATO & ENDEREÇO */}
          {activeSection === 'contato' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Telefone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="membro@email.com"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Endereço Residencial</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, Número, Complemento"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                    placeholder="Bairro"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Cidade"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Estado</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    placeholder="SP"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CEP</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="00000-000"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* SECTION 3: VIDA ECLESIÁSTICA */}
          {activeSection === 'eclesiastico' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cargo / Ministério</label>
                  <select
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as MinistryRole })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="Membro">Membro Comungante</option>
                    <option value="Congregado / Visitante">Congregado / Visitante</option>
                    <option value="Diácono">Diácono</option>
                    <option value="Diaconisa">Diaconisa</option>
                    <option value="Presbítero">Presbítero</option>
                    <option value="Evangelista">Evangelista</option>
                    <option value="Pastor">Pastor</option>
                    <option value="Pastora">Pastora</option>
                    <option value="Líder de Louvor">Líder de Louvor</option>
                    <option value="Líder de Jovens">Líder de Jovens</option>
                    <option value="Líder Infantil">Líder Infantil</option>
                    <option value="Professor(a) EBD">Professor(a) EBD</option>
                    <option value="Músico / Instrumentista">Músico / Instrumentista</option>
                    <option value="Sonoplasta / Mídia">Sonoplasta / Mídia</option>
                    <option value="Tesoureiro(a)">Tesoureiro(a)</option>
                    <option value="Secretário(a)">Secretário(a)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Situação de Membresia</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as MemberStatus })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  >
                    <option value="ativo">Ativo (Em plena comunhão)</option>
                    <option value="em_observacao">Em Observação / Visitante Frequente</option>
                    <option value="afastado">Afastado</option>
                    <option value="transferido">Transferido com Carta</option>
                    <option value="falecido">Falecido</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data de Membresia / Entrada</label>
                  <input
                    type="date"
                    value={formData.membershipDate}
                    onChange={e => setFormData({ ...formData, membershipDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Igreja de Origem (se houver)</label>
                  <input
                    type="text"
                    value={formData.previousChurch}
                    onChange={e => setFormData({ ...formData, previousChurch: e.target.value })}
                    placeholder="Ex: Igreja Batista Memorial"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Batismo */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Batizado nas Águas?</span>
                    <p className="text-[11px] text-slate-500">Por imersão conforme mandamento bíblico</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isBaptizedWater}
                    onChange={e => setFormData({ ...formData, isBaptizedWater: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                </div>

                {formData.isBaptizedWater && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Data do Batismo nas Águas</label>
                    <input
                      type="date"
                      value={formData.waterBaptismDate}
                      onChange={e => setFormData({ ...formData, waterBaptismDate: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white"
                    />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Batismo com o Espírito Santo?</span>
                    <p className="text-[11px] text-slate-500">Evidência bíblica e dons espirituais</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isBaptizedHolySpirit}
                    onChange={e => setFormData({ ...formData, isBaptizedHolySpirit: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded"
                  />
                </div>
              </div>

              {/* Departamentos */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Departamentos / Ministérios em que atua:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {departments.map(dept => {
                    const isSelected = formData.departmentIds.includes(dept.id);
                    return (
                      <div
                        key={dept.id}
                        onClick={() => handleDepartmentToggle(dept.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          isSelected 
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{dept.name}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          readOnly
                          className="rounded text-indigo-600 pointer-events-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: PASTORAL & EMERGÊNCIA */}
          {activeSection === 'observacoes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Contato de Emergência
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome do Contato</label>
                    <input
                      type="text"
                      value={formData.emergencyName}
                      onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
                      placeholder="Ex: Maria Santos"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={formData.emergencyPhone}
                      onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="(11) 98888-8888"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Parentesco</label>
                    <input
                      type="text"
                      value={formData.emergencyRel}
                      onChange={e => setFormData({ ...formData, emergencyRel: e.target.value })}
                      placeholder="Mãe / Irmão / Cônjuge"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observações Pastorais & Histórico Eclesiástico
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações relevantes sobre consagrações, discipulado, dons espirituais ou notas de aconselhamento confidencial..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              style={{ backgroundColor: theme.primaryHex }}
            >
              <Save className="w-4 h-4" />
              <span>{member ? 'Salvar Alterações' : 'Concluir Cadastro'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
