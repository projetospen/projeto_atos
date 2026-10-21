import React, { useState, useMemo } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { Member, MemberStatus } from '../../types';
import { MemberFormModal } from './MemberFormModal';
import { MemberDetailsModal } from './MemberDetailsModal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  CreditCard, 
  MessageCircle, 
  MoreVertical, 
  CheckCircle2, 
  Clock, 
  Phone, 
  LayoutGrid, 
  List, 
  Shield, 
  Droplet
} from 'lucide-react';

export const MembersView: React.FC = () => {
  const { members, departments, setSelectedMemberForCard, churchProfile } = useChurch();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [isBaptizedFilter, setIsBaptizedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [detailsMember, setDetailsMember] = useState<Member | null>(null);

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      // Search
      const searchMatch = !search.trim() || 
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.phone.includes(search) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.role.toLowerCase().includes(search.toLowerCase());

      // Status
      const statusMatch = selectedStatus === 'all' || m.status === selectedStatus;

      // Department
      const deptMatch = selectedDepartment === 'all' || m.departmentIds?.includes(selectedDepartment);

      // Baptism
      const baptismMatch = isBaptizedFilter === 'all' || 
        (isBaptizedFilter === 'sim' && m.isBaptizedWater) ||
        (isBaptizedFilter === 'nao' && !m.isBaptizedWater);

      return searchMatch && statusMatch && deptMatch && baptismMatch;
    });
  }, [members, search, selectedStatus, selectedDepartment, isBaptizedFilter]);

  // Status counts
  const totalCount = members.length;
  const activeCount = members.filter(m => m.status === 'ativo').length;
  const inObsCount = members.filter(m => m.status === 'em_observacao').length;
  const baptizedCount = members.filter(m => m.isBaptizedWater).length;

  const handleOpenAdd = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setIsFormOpen(true);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Nome Completo',
      'Cargo/Ministerio',
      'Status',
      'Telefone',
      'E-mail',
      'Nascimento',
      'Batizado em Aguas',
      'Data de Membresia',
      'Bairro',
      'Cidade',
      'Estado'
    ];

    const rows = filteredMembers.map(m => [
      `"${m.id}"`,
      `"${m.name.replace(/"/g, '""')}"`,
      `"${m.role}"`,
      `"${m.status}"`,
      `"${m.phone}"`,
      `"${m.email}"`,
      `"${m.birthDate}"`,
      `"${m.isBaptizedWater ? 'Sim' : 'Não'}"`,
      `"${m.membershipDate}"`,
      `"${m.neighborhood || ''}"`,
      `"${m.city}"`,
      `"${m.state}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `membros_${churchProfile.name.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-5">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Membros & Secretaria Eclesiástica</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadastros gerais, fichas de membresia, credenciais e carteirinhas digitais
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            title="Exportar lista atual para Excel/CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Membro</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setSelectedStatus('all')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'all' ? 'bg-indigo-50/80 border-indigo-200 shadow-2xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-slate-500 uppercase">Membros Cadastrados</span>
          <p className="text-xl font-extrabold text-slate-800 mt-0.5">{totalCount}</p>
        </div>

        <div 
          onClick={() => setSelectedStatus('ativo')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'ativo' ? 'bg-emerald-50/80 border-emerald-200 shadow-2xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Membros Ativos</span>
          <p className="text-xl font-extrabold text-emerald-800 mt-0.5">{activeCount}</p>
        </div>

        <div 
          onClick={() => setSelectedStatus('em_observacao')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            selectedStatus === 'em_observacao' ? 'bg-amber-50/80 border-amber-200 shadow-2xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-700 uppercase">Em Observação</span>
          <p className="text-xl font-extrabold text-amber-800 mt-0.5">{inObsCount}</p>
        </div>

        <div 
          onClick={() => setIsBaptizedFilter(isBaptizedFilter === 'sim' ? 'all' : 'sim')}
          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
            isBaptizedFilter === 'sim' ? 'bg-cyan-50/80 border-cyan-200 shadow-2xs' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-[11px] font-bold text-cyan-700 uppercase">Batizados nas Águas</span>
          <p className="text-xl font-extrabold text-cyan-800 mt-0.5">{baptizedCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone, e-mail, cargo pastoral..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden w-full md:w-48 text-slate-700"
            >
              <option value="all">Todos os Ministérios</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-hidden w-full md:w-40 text-slate-700"
            >
              <option value="all">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="em_observacao">Em Observação</option>
              <option value="afastado">Afastado</option>
              <option value="transferido">Transferido</option>
            </select>

            {/* View Switcher */}
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                title="Visualização em Tabela"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-2 transition-colors ${viewMode === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-800'}`}
                title="Visualização em Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Members List */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Nenhum membro encontrado</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tente ajustar os filtros de busca ou cadastre um novo membro para a congregação.
          </p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Agora</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Secretariat standard) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Membro</th>
                  <th className="py-3 px-3">Cargo / Função</th>
                  <th className="py-3 px-3">Contato</th>
                  <th className="py-3 px-3">Departamentos</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Membro Desde</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => {
                  const memberDepts = departments.filter(d => m.departmentIds?.includes(d.id));
                  const cleanPhone = m.phone.replace(/\D/g, '');
                  const whatsappMsg = encodeURIComponent(
                    `A paz do Senhor, ${m.name}! Entramos em contato da secretaria da ${churchProfile.name}.`
                  );

                  return (
                    <tr 
                      key={m.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Name & Photo */}
                      <td className="py-3 px-4">
                        <div 
                          onClick={() => setDetailsMember(m)}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                            {m.photoUrl ? (
                              <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                                {m.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs hover:text-indigo-600 transition-colors">
                              {m.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {m.neighborhood ? `${m.neighborhood}, ${m.city}` : m.city}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-slate-700">{m.role}</span>
                      </td>

                      {/* Contact */}
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-800">{m.phone}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{m.email}</p>
                      </td>

                      {/* Departments */}
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {memberDepts.length > 0 ? (
                            memberDepts.slice(0, 2).map(d => (
                              <span key={d.id} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">
                                {d.name.split(' ')[0]}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                          {memberDepts.length > 2 && (
                            <span className="text-[10px] text-slate-400">+{memberDepts.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.status === 'ativo' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : m.status === 'em_observacao'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {m.status === 'ativo' ? 'Ativo' : m.status === 'em_observacao' ? 'Em observação' : m.status}
                        </span>
                      </td>

                      {/* Membership Date */}
                      <td className="py-3 px-3 text-slate-500 font-medium">
                        {formatDate(m.membershipDate)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedMemberForCard(m)}
                            title="Emitir Carteirinha Oficial"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-4 h-4" />
                          </button>

                          <a
                            href={`https://wa.me/55${cleanPhone}?text=${whatsappMsg}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => setDetailsMember(m)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                          >
                            Ficha
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
      ) : (
        /* CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((m) => {
            const memberDepts = departments.filter(d => m.departmentIds?.includes(d.id));
            const cleanPhone = m.phone.replace(/\D/g, '');
            const whatsappMsg = encodeURIComponent(
              `A paz do Senhor, ${m.name}! Aqui é da secretaria da ${churchProfile.name}.`
            );

            return (
              <div 
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0">
                        {m.photoUrl ? (
                          <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-base">
                            {m.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 
                          onClick={() => setDetailsMember(m)}
                          className="font-bold text-slate-800 text-sm hover:text-indigo-600 cursor-pointer"
                        >
                          {m.name}
                        </h4>
                        <span className="text-xs font-semibold text-indigo-700 block">
                          {m.role}
                        </span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {m.status === 'ativo' ? 'Ativo' : 'Observação'}
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Telefone:</span>
                      <span className="font-medium text-slate-700">{m.phone}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Batizado em Águas:</span>
                      <span className="font-medium text-slate-700">{m.isBaptizedWater ? 'Sim' : 'Não'}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Membro desde:</span>
                      <span className="font-medium text-slate-700">{formatDate(m.membershipDate)}</span>
                    </p>
                  </div>

                  {/* Ministry Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {memberDepts.map(d => (
                      <span key={d.id} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                        {d.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedMemberForCard(m)}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Carteirinha</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/55${cleanPhone}?text=${whatsappMsg}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setDetailsMember(m)}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                    >
                      Ver Ficha
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      <MemberFormModal
        isOpen={isFormOpen}
        member={editingMember}
        onClose={() => setIsFormOpen(false)}
      />

      <MemberDetailsModal
        member={detailsMember}
        onClose={() => setDetailsMember(null)}
        onEdit={handleOpenEdit}
      />
    </div>
  );
};
