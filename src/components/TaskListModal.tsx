import React from 'react';
import { SanctuaryTask } from '../types';
import { SANCTUARY_TASKS } from '../data/sanctuaryTasks';
import { sounds } from '../audio/soundManager';
import { X, Star, CheckCircle, Hammer, Sparkles } from 'lucide-react';

interface TaskListModalProps {
  completedTaskIds: string[];
  userStars: number;
  onCompleteTask: (task: SanctuaryTask) => void;
  onClose: () => void;
}

export const TaskListModal: React.FC<TaskListModalProps> = ({
  completedTaskIds,
  userStars,
  onCompleteTask,
  onClose
}) => {
  const completedSet = new Set(completedTaskIds);

  // Find next available uncompleted task
  const pendingTasks = SANCTUARY_TASKS.filter(t => !completedSet.has(t.id));
  const doneTasks = SANCTUARY_TASKS.filter(t => completedSet.has(t.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s]">
      <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-3xl w-full max-w-lg shadow-2xl border-4 border-amber-400 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-800 text-white flex items-center justify-between border-b-2 border-amber-600">
          <div className="flex items-center gap-2">
            <Hammer className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl font-black font-['Fredoka']">Sanctuary Tasks</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-amber-950/70 px-3 py-1 rounded-full text-sm font-bold text-amber-300 border border-amber-600">
              <Star className="w-4 h-4 fill-current text-amber-400" />
              <span>{userStars} Stars</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-amber-700 active:scale-95 rounded-xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-amber-950 font-['Fredoka']">All Tasks Completed!</h3>
              <p className="text-sm text-amber-800 mt-1">
                The sanctuary is fully restored for Piper and Bodacious! You can still replay levels or re-skin any furniture anytime!
              </p>
            </div>
          ) : (
            pendingTasks.map((task, idx) => {
              const canAfford = userStars >= task.costStars;
              const isNext = idx === 0;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                    isNext
                      ? 'bg-white shadow-md border-amber-400 ring-2 ring-amber-300/50'
                      : 'bg-amber-100/60 border-amber-200 opacity-70'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold text-amber-700">Task {completedSet.size + idx + 1}</span>
                      <h4 className="text-base font-black text-amber-950 font-['Fredoka']">
                        {task.title}
                      </h4>
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  {isNext ? (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        sounds.playPurr();
                        onCompleteTask(task);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold font-['Fredoka'] text-sm shadow-md transition-all active:scale-95 whitespace-nowrap ${
                        canAfford
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 border-2 border-emerald-300'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current text-amber-300" />
                      <span>{task.costStars} {task.costStars === 1 ? 'Star' : 'Stars'}</span>
                    </button>
                  ) : (
                    <div className="text-xs font-bold text-amber-700/80 bg-amber-200/60 px-3 py-1.5 rounded-xl">
                      Locked
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Already Completed Section */}
          {doneTasks.length > 0 && (
            <div className="pt-4 border-t border-amber-200">
              <h4 className="text-xs uppercase font-black text-amber-800 mb-2">
                Restored Improvements ({doneTasks.length})
              </h4>
              <div className="space-y-1.5">
                {doneTasks.map(t => (
                  <div
                    key={t.id}
                    className="p-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 font-bold"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-emerald-700">Restored ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
