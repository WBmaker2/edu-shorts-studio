import React from 'react';
import { FolderOpen, Play, Folder, Trash2, Calendar, BookOpen } from 'lucide-react';
import type { ShortsProject } from '../types';

interface ProjectManagementPageProps {
  projects: ShortsProject[];
  onSelectProject: (p: ShortsProject) => void;
  onDeleteProject: (id: string) => void;
  onShowInFolder: (path: string) => void;
  onOpenVideoFile: (path: string) => void;
  onNavigateToCreate: () => void;
}

export const ProjectManagementPage: React.FC<ProjectManagementPageProps> = ({
  projects,
  onSelectProject,
  onDeleteProject,
  onShowInFolder,
  onNavigateToCreate,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Sheet */}
      <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E40AF]">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#14213D]">
              수업 교안 및 완성 클립 보관함
            </h1>
            <p className="text-xs text-[#3D4B66] font-medium tabular-nums">
              이 PC에 저장된 수업 쇼츠 프로젝트 총 {projects.length}편
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E40AF] hover:bg-[#1E3A8A] text-white text-xs font-extrabold transition-colors shrink-0 self-start md:self-auto"
        >
          <BookOpen className="w-4 h-4" />
          <span>새 수업 쇼츠 만들기</span>
        </button>
      </section>

      {/* Projects Ledger */}
      {projects.length === 0 ? (
        <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl p-14 text-center space-y-3">
          <FolderOpen className="w-10 h-10 mx-auto stroke-[1.6] text-[#5C6B85]" />
          <h3 className="text-sm font-extrabold text-[#14213D]">저장된 수업 쇼츠 프로젝트가 없습니다</h3>
          <p className="text-xs text-[#3D4B66] max-w-sm mx-auto font-medium">
            단원 수업 쇼츠 제작 탭에서 학습 주제를 입력하고 첫 번째 수업 자료를 만들어 보세요.
          </p>
          <button
            type="button"
            onClick={onNavigateToCreate}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E40AF] text-white hover:bg-[#1E3A8A] text-xs font-extrabold transition-colors"
          >
            수업 쇼츠 제작 시작
          </button>
        </section>
      ) : (
        <section className="bg-[#FFFDF8] border border-[#E5DEC9] rounded-xl overflow-hidden divide-y divide-[#E5DEC9]">
          {projects.map((p) => {
            const dateStr = new Date(p.createdAt).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={p.id}
                className="p-5 hover:bg-[#FAF8F3] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded shrink-0 ${
                        p.status === 'done'
                          ? 'bg-[#DCFCE7] text-[#14532D] border border-[#86EFAC]'
                          : 'bg-[#FEF3C7] text-[#78350F] border border-[#FCD34D]'
                      }`}
                    >
                      {p.status === 'done' ? '렌더링 완료' : '작업 중'}
                    </span>
                    <h3 className="font-extrabold text-sm text-[#14213D] truncate">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#3D4B66] line-clamp-2 leading-relaxed font-medium">
                    {p.script || p.prompt}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-[#5C6B85] font-semibold tabular-nums pt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>·</span>
                    <span className="text-[#14213D] font-bold">약 {p.durationSeconds || 55}초</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {p.videoPath && (
                    <>
                      <button
                        type="button"
                        onClick={() => onSelectProject(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#1E40AF] text-[#1E40AF] hover:text-white border border-[#BFDBFE] font-bold text-xs flex items-center gap-1.5 transition-colors"
                        title="미리보기 재생"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>재생</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onShowInFolder(p.videoPath!)}
                        className="p-2 rounded-lg bg-[#FAF8F3] hover:bg-[#F2EFE6] text-[#14213D] border border-[#CFC6AE] transition-colors"
                        title="폴더에서 보기"
                      >
                        <Folder className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => onDeleteProject(p.id)}
                    className="p-2 rounded-lg text-[#5C6B85] hover:text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors"
                    title="프로젝트 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
};
