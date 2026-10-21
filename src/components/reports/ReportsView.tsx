import React, { useState } from 'react';
import { useChurch } from '../../context/ChurchContext';
import { 
  FileText, 
  Printer, 
  Users, 
  Cake, 
  Droplet, 
  ShieldCheck, 
  Church, 
  Download, 
  Award, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { members, departments, events, churchProfile } = useChurch();

  const [activeReport, setActiveReport] = useState<'membresia' | 'aniversariantes' | 'carta_recomendacao'>('membresia');
  const [selectedMemberForLetter, setSelectedMemberForLetter] = useState<string>(members[0]?.id || '');
  const [destinationChurch, setDestinationChurch] = useState('Igreja Batista de Florianópolis - SC');

  const handlePrint = () => {
    window.print();
  };

  // Stats calculation
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'ativo').length;
  const inObs = members.filter(m => m.status === 'em_observacao').length;
  const baptizedWater = members.filter(m => m.isBaptizedWater).length;
  const baptizedSpirit = members.filter(m => m.isBaptizedHolySpirit).length;

  const marriedCount = members.filter(m => m.maritalStatus === 'casado').length;
  const singleCount = members.filter(m => m.maritalStatus === 'solteiro').length;
  const otherMarital = totalMembers - marriedCount - singleCount;

  // Month Birthdays (October)
  const currentMonth = new Date().getMonth() + 1;
  const birthdaysThisMonth = members.filter(m => {
    if (!m.birthDate) return false;
    return parseInt(m.birthDate.split('-')[1], 10) === currentMonth;
  }).sort((a, b) => a.birthDate.split('-')[2].localeCompare(b.birthDate.split('-')[2]));

  const letterMember = members.find(m => m.id === selectedMemberForLetter);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Relatórios Estatísticos & Documentos Eclesiásticos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Relatórios demográficos da membresia, boletim de aniversariantes e cartas de transferência pastoral
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Relatório</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 overflow-x-auto">
        <button
          onClick={() => setActiveReport('membresia')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
            activeReport === 'membresia' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Demografia da Membresia</span>
        </button>

        <button
          onClick={() => setActiveReport('aniversariantes')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
            activeReport === 'aniversariantes' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Cake className="w-4 h-4" />
          <span>Boletim de Aniversariantes do Mês ({birthdaysThisMonth.length})</span>
        </button>

        <button
          onClick={() => setActiveReport('carta_recomendacao')}
          className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 shrink-0 transition-colors ${
            activeReport === 'carta_recomendacao' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Carta de Recomendação & Mudança</span>
        </button>
      </div>

      {/* REPORT 1: DEMOGRAFIA */}
      {activeReport === 'membresia' && (
        <div className="bg-white rounded-b-2xl p-6 border border-slate-200 shadow-xs space-y-6 printable-report">
          <div className="text-center border-b border-slate-200 pb-4">
            <h3 className="font-extrabold text-base text-slate-800 uppercase">{churchProfile.name}</h3>
            <p className="text-xs text-slate-500">Relatório Demográfico Eclesiástico Geral • Secretaria</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Emitido em {new Date().toLocaleDateString('pt-BR')} • CNPJ: {churchProfile.cnpj}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Situação */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Situação Eclesiástica</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Membros Ativos (Plena Comunhão):</span>
                  <strong className="text-emerald-700">{activeMembers} ({Math.round((activeMembers / totalMembers) * 100)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Em Observação / Visitantes:</span>
                  <strong className="text-amber-700">{inObs}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span>Total de Registros:</span>
                  <span>{totalMembers}</span>
                </div>
              </div>
            </div>

            {/* Vida Sacramental */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Vida Sacramental</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Batizados em Águas:</span>
                  <strong className="text-indigo-700">{baptizedWater} ({Math.round((baptizedWater / totalMembers) * 100)}%)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Não Batizados nas Águas:</span>
                  <strong className="text-slate-700">{totalMembers - baptizedWater}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Batizados no Espírito Santo:</span>
                  <strong className="text-purple-700">{baptizedSpirit}</strong>
                </div>
              </div>
            </div>

            {/* Estado Civil */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Perfil Conjugal</h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Casados:</span>
                  <strong className="text-slate-800">{marriedCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Solteiros:</span>
                  <strong className="text-slate-800">{singleCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Viúvos / Divorciados:</span>
                  <strong className="text-slate-800">{otherMarital}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="pt-2">
            <h4 className="font-bold text-slate-800 text-sm mb-3">Distribuição por Departamento Ministerial</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {departments.map(d => {
                const count = members.filter(m => m.departmentIds?.includes(d.id)).length;
                return (
                  <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{d.name}</p>
                      <p className="text-[11px] text-slate-400">{d.meetingSchedule || 'Atuação regular'}</p>
                    </div>
                    <span className="font-bold text-indigo-700 px-2 py-0.5 bg-indigo-50 rounded">
                      {count} voluntários
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: ANIVERSARIANTES */}
      {activeReport === 'aniversariantes' && (
        <div className="bg-white rounded-b-2xl p-6 border border-slate-200 shadow-xs space-y-6 printable-report">
          <div className="text-center border-b border-slate-200 pb-4">
            <h3 className="font-extrabold text-base text-slate-800 uppercase">{churchProfile.name}</h3>
            <p className="text-xs text-slate-500">Boletim Oficial de Aniversariantes do Mês de Outubro</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px]">
                  <th className="py-2.5 px-3">Dia</th>
                  <th className="py-2.5 px-3">Nome do Aniversariante</th>
                  <th className="py-2.5 px-3">Cargo / Ministério</th>
                  <th className="py-2.5 px-3">Telefone</th>
                  <th className="py-2.5 px-3">Bairro / Cidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {birthdaysThisMonth.map(m => {
                  const day = m.birthDate.split('-')[2];
                  return (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-amber-700 text-sm">
                        Dia {day}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        {m.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {m.role}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {m.phone}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {m.neighborhood ? `${m.neighborhood}, ${m.city}` : m.city}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: CARTA DE RECOMENDAÇÃO */}
      {activeReport === 'carta_recomendacao' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selecione o Membro:</label>
              <select
                value={selectedMemberForLetter}
                onChange={e => setSelectedMemberForLetter(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50"
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[240px]">
              <label className="block font-bold text-slate-700 mb-1">Igreja Destinatária:</label>
              <input
                type="text"
                value={destinationChurch}
                onChange={e => setDestinationChurch(e.target.value)}
                placeholder="Nome da igreja que receberá o irmão"
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Letter Document Preview */}
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-3xl mx-auto printable-letter font-serif space-y-6 text-sm text-slate-800 leading-relaxed">
            <div className="text-center border-b-2 border-slate-300 pb-5 font-sans">
              <Church className="w-10 h-10 mx-auto text-amber-600 mb-2" />
              <h3 className="font-extrabold text-lg text-slate-900 tracking-wide uppercase">{churchProfile.name}</h3>
              <p className="text-xs text-slate-500 font-mono">CNPJ: {churchProfile.cnpj} • {churchProfile.address}</p>
              <p className="text-xs text-slate-500">{churchProfile.cityState} • Tel: {churchProfile.phone}</p>
            </div>

            <div className="text-center py-2 font-sans">
              <h4 className="font-bold text-base uppercase tracking-widest text-slate-900 underline">
                CARTA DE RECOMENDAÇÃO & TRANSFERÊNCIA ECLESIÁSTICA
              </h4>
            </div>

            <p>
              À mui digna liderança pastoral da <strong>{destinationChurch}</strong>,
            </p>

            <p className="indent-8 text-justify">
              Graça e paz da parte de nosso Senhor e Salvador Jesus Cristo.
            </p>

            <p className="indent-8 text-justify">
              Pela presente, temos a honra e a satisfação de recomendar à vossa comunhão e aos cuidados espirituais deste estimado rebanho o(a) nosso(a) irmão(ã) em Cristo <strong>{letterMember?.name || '________________________'}</strong>, portador(a) do RG/CPF <strong>{letterMember?.cpf || 'Cadastrado na Secretaria'}</strong>, que até a presente data foi membro regular em plena comunhão nesta comunidade eclesiástica desde <strong>{formatDate(letterMember?.membershipDate)}</strong>, exercendo com zelo e testemunho cristão o cargo de <strong>{letterMember?.role || 'Membro'}</strong>.
            </p>

            <p className="indent-8 text-justify">
              Certificamos que o(a) referido(a) irmão(ã) é batizado(a) bíblicamente nas águas por imersão, não constando em nossos registros disciplinares qualquer impedimento de ordem moral, doutrinária ou administrativa que desabone sua conduta cristã.
            </p>

            <p className="indent-8 text-justify">
              Rogamos as mais ricas bênçãos de Deus sobre sua nova caminhada de fé junto a esse valoroso ministério.
            </p>

            <p className="text-right pt-4">
              {churchProfile.cityState.split(',')[0]}, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>

            <div className="pt-10 grid grid-cols-2 gap-8 text-center font-sans text-xs">
              <div>
                <div className="border-b border-slate-400 mb-1.5"></div>
                <p className="font-bold text-slate-800">{churchProfile.secretaryName}</p>
                <p className="text-[10px] text-slate-500">Secretária Eclesiástica</p>
              </div>

              <div>
                <div className="border-b border-slate-400 mb-1.5"></div>
                <p className="font-bold text-slate-800">{churchProfile.seniorPastor}</p>
                <p className="text-[10px] text-slate-500">Pastor Presidente</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
