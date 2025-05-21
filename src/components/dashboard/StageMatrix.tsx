import React, { useState } from "react";
import { PROJECT_STAGES, STAGE_LABELS, ROLE_STAGE_ACCESS } from "../../types/stages";
import { TaskState } from "../../types/task";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useSales } from "../../context/SalesContext";
import { TaskModal } from "./TaskModal";
import { cn } from "../../lib/utils";
import { ProgressIndicator } from "./ProgressIndicator";

interface RowAccessState {
  isActive: boolean;
  canInteract: boolean;
}

interface TaskCompletionState {
  taskId: number;
  roleId: string;
  completedAt: string;
}

export const StageMatrix: React.FC = () => {
  const { user } = useAuth();
  const { stages, currentStage, updateStage, completeStage } = useSales();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<TaskCompletionState[]>(() => {
    // Initialize with empty array to ensure no tasks are completed by default
    return [];
  });
  const [taskDependencies, setTaskDependencies] = useState<Record<number, number[]>>({
    // Alpha Sales dependencies
    2: [1],
    3: [2],
    4: [3],
    5: [4],
    6: [5],
    7: [6],
    8: [7],
    9: [8],
    11: [9],
    // Alpha SSC dependencies
    13: [12],
    14: [13],
    15: [14],
    16: [15],
    17: [16],
    18: [17],
    19: [18],
    // Espora Strategy dependencies
    21: [20],
    22: [21],
    23: [22],
    24: [23],
    25: [24],
    26: [25],
    // Espora Diffusion dependencies
    31: [30],
    32: [31],
    33: [32],
    34: [33],
    35: [34],
    36: [35],
    37: [36],
    38: [37],
    39: [38],
    // Espora Production dependencies
    41: [40],
    42: [41],
    43: [42],
    44: [43],
    45: [44],
    // Espora Management dependencies
    54: [53],
    55: [54],
    56: [55],
    57: [56],
    58: [57],
    59: [58],
    // Espora Accompaniment dependencies - First row
    61: [60],
    62: [61],
    63: [62],
    64: [63],
    65: [64],
    66: [65],
    67: [66],
    68: [67],
    69: [68],
    70: [69],
    82: [70],
    // Espora Accompaniment dependencies - Second row
    72: [71],
    73: [72],
    74: [73],
    75: [74],
    76: [75],
    77: [76],
    78: [77],
    79: [78],
    80: [79],
    81: [80],
    83: [81],
    // Testank Studies dependencies
    91: [90],
    92: [91],
    93: [92],
    94: [93],
    95: [94],
    96: [95],
    97: [96],
    98: [97],
    99: [98],
    100: [99]
  });

  const getRowAccessState = (rowRole: string): RowAccessState => {
    if (!user) return { isActive: false, canInteract: false };
    
    if (user.role === "super-admin") {
      return { isActive: true, canInteract: true };
    }
    
    const isCurrentUserRow = user.role === rowRole;
    return {
      isActive: isCurrentUserRow,
      canInteract: isCurrentUserRow
    };
  };

  const handleButtonClick = (taskNumber: number, rowRole: string) => {
    if ((user?.role === "super-admin" || getRowAccessState(rowRole).canInteract) && isTaskUnlocked(taskNumber, rowRole)) {
      setSelectedTask(taskNumber);
      setSelectedRole(rowRole);
      
      // Update sales stage if in sales pipeline
      if (rowRole === "alpha-sales" && taskNumber <= 8) {
        updateStage(taskNumber);
      }
    }
  };

  const isTaskUnlocked = (taskNumber: number, roleId: string): boolean => {
    if (user?.role === "super-admin") return true;
    
    const dependencies = taskDependencies[taskNumber];
    if (!dependencies) return true;
    
    return dependencies.every(depId => isTaskCompleted(depId, roleId));
  };

  const handleTaskCompletion = (taskNumber: number, isCompleted: boolean) => {
    if (!selectedRole) return;
    
    // Handle sales pipeline completion
    if (selectedRole === "alpha-sales" && taskNumber <= 8 && isCompleted) {
      completeStage(taskNumber);
    }
    
    setCompletedTasks(prev => {
      // Remove existing completion state for this task and role
      const filtered = prev.filter(t => !(t.taskId === taskNumber && t.roleId === selectedRole));
      
      // Add new completion state if task is completed
      if (isCompleted) {
        return [...filtered, { 
          taskId: taskNumber, 
          roleId: selectedRole,
          completedAt: new Date().toISOString()
        }];
      }
      
      return filtered;
    });
  };

  const isTaskCompleted = (taskNumber: number, roleId: string): boolean => {
    // Only return true if the task is explicitly marked as completed
    return completedTasks.some(t => 
      t.taskId === taskNumber && 
      t.roleId === roleId && 
      t.completedAt
    );
  };

  const getTaskCount = (roleId: string, stage: string): { completed: number; total: number } => {
    const taskRanges: Record<string, Record<string, [number, number]>> = {
      'alpha-sales': {
        'acquisition': [1, 9],
        'eho': [101, 101],
        'development': [11, 11]
      },
      'alpha-ssc': {
        'acquisition': [10, 10],
        'eho': [101, 101],
        'development': [12, 18],
        'presentation': [19, 19]
      },
      'espora-strategy': {
        'eho': [101, 101],
        'development': [20, 26]
      },
      'espora-diffusion': {
        'eho': [101, 101],
        'development': [30, 39]
      },
      'espora-production': {
        'eho': [101, 101],
        'development': [40, 45]
      },
      'espora-management': {
        'eho': [101, 101],
        'development': [53, 58],
        'presentation': [59, 59]
      },
      'espora-accompaniment': {
        'eho': [101, 101],
        'development': [60, 83]
      },
      'testank-studies': {
        'eho': [101, 101],
        'development': [90, 99],
        'presentation': [100, 100]
      }
    };

    const range = taskRanges[roleId]?.[stage];
    if (!range) return { completed: 0, total: 0 };

    const [start, end] = range;
    const total = end - start + 1;
    const completed = Array.from({ length: total }, (_, i) => start + i)
      .filter(taskId => isTaskCompleted(taskId, roleId))
      .length;

    return { completed, total };
  };

  const getButtonStyles = (taskNumber: number, roleId: string, hasLogo: boolean = false) => {
    const completed = isTaskCompleted(taskNumber, roleId);
    const unlocked = isTaskUnlocked(taskNumber, roleId);
    const { canInteract } = getRowAccessState(roleId);
    
    const baseStyles = `
      h-6 w-[50px]
      relative p-0 text-sm font-medium
      flex items-center justify-center
      before:content-[''] before:absolute before:inset-0
      before:border before:border-current before:opacity-20
      after:content-[''] after:absolute after:inset-0 after:bg-gradient-to-b after:opacity-10
      ${completed
        ? 'text-white bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg before:border-white/30'
        : unlocked
          ? 'text-white bg-gradient-to-b from-gray-400 to-gray-500 shadow-md hover:from-gray-500 hover:to-gray-600'
          : 'text-gray-400 bg-gradient-to-b from-gray-100 to-gray-200 cursor-not-allowed'}
      ${!canInteract && !completed ? 'opacity-50' : ''}
      [clip-path:polygon(0_0,85%_0,100%_50%,85%_100%,0_100%,15%_50%)]
      [&:not(:first-child)]:ml-[-15px]
      backdrop-blur-sm
    `;
    
    return baseStyles;
  };

  return (
    <div className="w-full h-[calc(100vh-140px)]">
      <div className="w-full h-full flex flex-col pl-24">
        <div className="grid gap-1 mb-1 sticky top-0 z-50 bg-gradient-to-br from-gray-50 to-gray-100" style={{ gridTemplateColumns: '25% 10.5% 45% 10.5% 9%' }}>
          {PROJECT_STAGES.map((stage) => (
            <div
              key={stage}
              className="bg-gradient-to-b from-gray-800 to-gray-900 text-white px-3 py-2 text-center text-xs font-medium truncate rounded-md shadow-sm backdrop-blur-sm"
            >
              {STAGE_LABELS[stage]}
            </div>
          ))}
        </div>
        
        {/* Role rows with stage access */}
        <div className="grid gap-0.5 h-[calc(100%-40px)]" style={{ gridTemplateRows: 'repeat(8, 1fr)' }}>
          {ROLE_STAGE_ACCESS.map((access) => {
            const { isActive, canInteract } = getRowAccessState(access.role);
            
            return (
              <div 
                key={access.role} 
                className={cn(
                  "relative grid gap-0.5 h-full",
                  "hover:z-10",
                  !canInteract && user?.role !== "super-admin" && "pointer-events-none"
                )}
                style={{ gridTemplateColumns: '25% 10.5% 45% 10.5% 9%' }}
              >
                <div className="absolute -left-[6.5rem] h-full flex items-center justify-center w-[6rem]">
                  <span className={cn("text-[10px] font-medium tracking-wider flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white px-2 py-1 rounded-md shadow-sm backdrop-blur-sm min-h-[24px]",
                    access.role === 'alpha-sales' && "from-gray-800  to-gray-900",
                    access.role === 'alpha-ssc' && "from-gray-800 to-gray-900",
                    access.role === 'espora-strategy' && "from-gray-800 to-gray-900",
                    access.role === 'espora-diffusion' && "from-gray-800 to-gray-900",
                    access.role === 'espora-production' && "from-gray-800 to-gray-900",
                    access.role === 'espora-management' && "from-gray-800 to-gray-900",
                    access.role === 'espora-accompaniment' && "from-gray-800 to-gray-900",
                    access.role === 'testank-studies' && "from-gray-800 to-gray-900"
                  )} style={{ width: '5.5rem', textAlign: 'center' }}>
                    {access.role === 'alpha-sales' ? <span>Ventas</span> :
                      access.role === 'alpha-ssc' ? <span>SSC</span> :
                      access.role === 'espora-strategy' ? <span>Espora Estrategia</span> :
                      access.role === 'testank-studies' ? <span>Testank Estudios</span> :
                      access.role === 'espora-accompaniment' ? <span>Espora Acompañamiento</span> :
                      access.role === 'espora-management' ? <span>Espora Gerencia</span> :
                      access.role === 'espora-production' ? <span>Espora Producción</span> :
                      access.role === 'espora-diffusion' ? <span>Espora Difusión</span> : ''}
                  </span>
                </div>
                {PROJECT_STAGES.map((stage) => {
                  const hasAccess = access.stages.includes(stage);
                  const isFirstCell = access.role === "alpha-sales" && stage === "acquisition";
                  
                  const cellStyles = `
                    relative h-full p-0.5 transition-all duration-300 ease-in-out 
                    flex flex-col items-center justify-between py-0.5
                    ${hasAccess && getTaskCount(access.role, stage).total > 0 ? getBackgroundColor(access.role, hasAccess) : 'bg-transparent'}
                    ${!isActive && user?.role !== access.role ? 'opacity-60 saturate-[0.85]' : ''}
                    ${(hasAccess && (isActive || user?.role === "super-admin")) ? 'hover:z-20' : ''}
                    ${stage === "acquisition" ? 'origin-left' : 
                      stage === "calibration" ? 'origin-right' : 
                      'origin-center'}
                    ${hasAccess && getTaskCount(access.role, stage).total > 0 ? 'rounded-lg border border-white/50' : ''}
                    hover:z-10
                  `;
                  
                  return (
                    <div
                      key={`${access.role}-${stage}`}
                      className={cellStyles}
                    >
                      {hasAccess && (
                        <>
                        {getTaskCount(access.role, stage).total > 0 && (
                        <ProgressIndicator
                          {...getTaskCount(access.role, stage)}
                          className="mb-1"
                          isDarkBg={access.role === 'alpha-sales' || access.role === 'espora-strategy' || access.role === 'espora-production' || access.role === 'espora-accompaniment'}
                        />
                        )}
                        </>
                      )}
                      {stage === "acquisition" && access.role === "alpha-ssc" && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(10, access.role)}
                            className={getButtonStyles(10, access.role, true)}
                          />
                        </div>
                      )}
                      {isFirstCell && (
                        <div className="flex flex-col w-full h-full transition-all duration-300 ease-in-out">
                          <div className="relative flex items-center justify-center h-full w-full">
                            <div className="flex items-center gap-0 transition-all duration-300 ease-in-out mx-auto">
                              <div className="flex items-center justify-center">
                                {[...Array(8)].map((_, i) => {
                                  return (
                                  <Button
                                    key={i}
                                    aria-label={`Process ${i + 1}`}
                                    onClick={() => handleButtonClick(i + 1, access.role)}
                                    disabled={!canInteract}
                                    className={getButtonStyles(i + 1, access.role, false)}
                                  >
                                    {i + 1}
                                  </Button>
                                )})}
                              </div>
                              <Button
                                onClick={() => handleButtonClick(9, access.role)}
                                className={getButtonStyles(9, access.role)}>
                                9
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {stage === "development" && access.role === "alpha-sales" && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(11, access.role)}
                            className={getButtonStyles(11, access.role, true)}
                          />
                        </div>
                      )}
                      {stage === "development" && access.role === "alpha-ssc" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(5)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(12 + i, access.role)}
                              className={`${getButtonStyles(12 + i, access.role)} w-[100px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i + 1}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(17, access.role)}
                            className={`${getButtonStyles(17, access.role)} w-[100px]`}
                          >
                            6
                          </Button>
                          <Button
                            onClick={() => handleButtonClick(18, access.role)}
                            className={`${getButtonStyles(18, access.role)} w-[100px]`}
                          >
                            7
                          </Button>
                        </div>
                      )}
                      {stage === "presentation" && access.role === "alpha-ssc" && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(19, access.role)}
                            className={getButtonStyles(19, access.role, true)}
                          />
                        </div>
                      )}
                      {stage === "development" && access.role === "espora-strategy" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(6)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(20 + i, access.role)}
                              className={`${getButtonStyles(20 + i, access.role)} w-[100px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : i === 5 ? "6" : "7"}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(26, access.role)}
                            className={`${getButtonStyles(26, access.role)} w-[100px]`}
                          >
                            7
                          </Button>
                        </div>
                      )}
                      {stage === "development" && access.role === "espora-diffusion" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(9)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(30 + i, access.role)}
                              className={`${getButtonStyles(30 + i, access.role)} w-[120px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : i === 5 ? "6" : i + 1}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(39, access.role)}
                            className={`${getButtonStyles(39, access.role)} w-[120px]`}
                          >
                            10
                          </Button>
                        </div>
                      )}
                      {stage === "development" && access.role === "espora-production" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(5)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(40 + i, access.role)}
                              className={`${getButtonStyles(40 + i, access.role)} w-[100px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : "6"}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(45, access.role)}
                            className={`${getButtonStyles(45, access.role)} w-[100px]`}
                          >
                            6
                          </Button>
                        </div>
                      )}
                      {stage === "eho" && access.role === "espora-management" && (
                        <div className="flex items-center justify-center gap-1.5 h-full">
                          
                        </div>
                      )}
                      {stage === "development" && access.role === "espora-management" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(5)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(53 + i, access.role)}
                              className={`${getButtonStyles(53 + i, access.role)} w-[120px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : "6"}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(58, access.role)}
                              className={`${getButtonStyles(58, access.role)} w-[120px]`}
                          >
                            6
                          </Button>
                        </div>
                      )}
                      {stage === "presentation" && access.role === "espora-management" && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(59, access.role)}
                            className={getButtonStyles(59, access.role, true)}
                          />
                        </div>
                      )}
                      {stage === "development" && access.role === "espora-accompaniment" && (
                        <div className="flex flex-col gap-1 w-full px-1">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center w-full">
                            {[...Array(12)].map((_, i) => (
                              <Button
                                key={i}
                                aria-label={`Process ${i + 1}`}
                                onClick={() => handleButtonClick(60 + i, access.role)}
                                className={`${getButtonStyles(60 + i, access.role)} w-[80px]`}
                              > 
                               {i + 1}
                              </Button>
                            ))}
                            </div>
                            <div className="flex items-center justify-center w-full">
                            {[...Array(12)].map((_, i) => (
                              <Button
                                key={i}
                                aria-label={`Process ${i + 13}`}
                                onClick={() => handleButtonClick(72 + i, access.role)}
                                className={`${getButtonStyles(71 + i, access.role)} w-[80px]`}
                              >
                               {i + 13}
                              </Button>
                            ))}
                            </div>
                          </div>
                        </div>
                      )}
                      {stage === "development" && access.role === "testank-studies" && (
                        <div className="flex items-center justify-center w-full h-full">
                          {[...Array(9)].map((_, i) => (
                            <Button
                              key={i}
                              aria-label={`Process ${i + 1}`}
                              onClick={() => handleButtonClick(90 + i, access.role)}
                              className={`${getButtonStyles(90 + i, access.role)} w-[120px]`}
                            >
                              {i === 0 ? "1" : i === 1 ? "2" : i === 2 ? "3" : i === 3 ? "4" : i === 4 ? "5" : i === 5 ? "6" : i === 6 ? "7" : i === 7 ? "8" : i === 8 ? "9" : i + 1}
                            </Button>
                          ))}
                          <Button
                            onClick={() => handleButtonClick(99, access.role)}
                              className={`${getButtonStyles(99, access.role)} w-[120px]`}
                          >
                            10
                          </Button>
                        </div>
                      )}
                      {stage === "presentation" && access.role === "testank-studies" && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(100, access.role)}
                            className={getButtonStyles(100, access.role, true)}
                          />
                        </div>
                      )}
                      {stage === "eho" && hasAccess && (
                        <div className="flex items-center justify-center h-full">
                          <Button
                            onClick={() => handleButtonClick(101, access.role)}
                            className={getButtonStyles(101, access.role, true)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <TaskModal
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        taskNumber={selectedTask || 0}
        isOrangeButton={user?.role === "alpha-ssc"}
        onComplete={(taskNum, completed) => handleTaskCompletion(taskNum, completed)}
        isCompleted={selectedTask && selectedRole ? isTaskCompleted(selectedTask, selectedRole) : false}
      />
    </div>
  );
};

function getBackgroundColor(role: string, hasAccess: boolean): string {
  if (!hasAccess) return 'bg-gray-100';
  
  const baseStyles = "backdrop-blur-sm shadow-md border border-white/50";
  const darkGradient = "bg-gradient-to-br from-gray-800/90 via-gray-700/90 to-gray-800/90 text-white";
  const lightGradient = "bg-gradient-to-br from-gray-200/90 via-gray-300/90 to-gray-200/90";
  
  switch (role) {
    case 'alpha-sales':
      return `${darkGradient} ${baseStyles}`;
    case 'alpha-ssc':
      return `${lightGradient} ${baseStyles}`;
    case 'espora-strategy':
      return `${darkGradient} ${baseStyles}`;
    case 'espora-diffusion':
      return `${lightGradient} ${baseStyles}`;
    case 'espora-production':
      return `${darkGradient} ${baseStyles}`;
    case 'espora-management':
      return `${lightGradient} ${baseStyles}`;
    case 'espora-accompaniment':
      return `${darkGradient} ${baseStyles}`;
    case 'testank-studies':
      return `${lightGradient} ${baseStyles}`;
    default:
      return `${lightGradient} ${baseStyles}`;
  }
}