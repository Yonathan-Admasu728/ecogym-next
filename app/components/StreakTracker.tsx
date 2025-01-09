import { motion, AnimatePresence } from 'framer-motion';
import { FC } from 'react';
import { useStreak } from '../hooks/useStreak';

const variants = {
  fadeInScale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  },
  progressRing: {
    initial: { pathLength: 0, opacity: 0 },
    animate: (percentage: number) => ({
      pathLength: percentage / 100,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    })
  },
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
  },
  item: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  }
};

const StreakTracker: FC = (): JSX.Element => {
  const { isLoading, error, streakStats } = useStreak();

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          variants={variants.fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          className="animate-pulse bg-darkBlue-800/50 rounded-lg p-6"
        >
          <div className="h-4 bg-darkBlue-700/50 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-darkBlue-700/50 rounded w-3/4"></div>
        </motion.div>
      ) : error ? (
        <motion.div
          key="error"
          variants={variants.fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-darkBlue-800/50 rounded-lg p-6"
        >
          <div className="text-red-400">{error}</div>
        </motion.div>
      ) : !streakStats ? null : (
        <motion.div
          key="content"
          variants={variants.fadeInScale}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-darkBlue-800/50 backdrop-blur-sm rounded-lg p-6 shadow-md border border-turquoise-400/20"
        >
          <motion.div 
            className="space-y-6"
            variants={variants.container}
            initial="initial"
            animate="animate"
          >
            {/* Circular Progress with Current Streak */}
            <motion.div 
              className="relative w-32 h-32 mx-auto"
              variants={variants.item}
            >
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  className="fill-none stroke-darkBlue-700"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="60"
                  className="fill-none stroke-current text-turquoise-400"
                  strokeWidth="8"
                  strokeLinecap="round"
                  variants={variants.progressRing}
                  custom={streakStats.streakPercentage}
                  style={{ pathLength: streakStats.streakPercentage / 100 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-3xl font-bold text-teal-200"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  {streakStats.currentStreak}
                </motion.span>
                <span className="text-sm text-lightBlue-100">Day Streak</span>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 gap-4"
              variants={variants.item}
            >
              <motion.div
                variants={variants.fadeInScale}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xl font-semibold text-teal-200">
                  {streakStats.longestStreak}
                </p>
                <p className="text-sm text-lightBlue-100">Longest Streak</p>
              </motion.div>
              <motion.div
                variants={variants.fadeInScale}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xl font-semibold text-teal-200">
                  {streakStats.totalCompletions}
                </p>
                <p className="text-sm text-lightBlue-100">Total Completions</p>
              </motion.div>
            </motion.div>

            {/* Interactive Calendar */}
            <motion.div variants={variants.item} className="mt-6">
              <h4 className="text-teal-200 font-medium mb-4 flex items-center justify-between">
                <span>Activity Calendar</span>
                <span className="text-sm text-lightBlue-100">Last 30 Days</span>
              </h4>
              <div className="grid grid-cols-7 gap-1.5">
                {streakStats.streakHistory.slice(-30).map((day, index) => {
                  const date = new Date(day.date);
                  const isToday = new Date().toDateString() === date.toDateString();
                  return (
                    <motion.div
                      key={day.date}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                      className={`
                        relative aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                        transition-colors duration-200
                        ${isToday ? 'ring-2 ring-turquoise-400' : ''}
                        ${
                          day.completed
                            ? 'bg-gradient-to-br from-turquoise-400/30 to-teal-400/30 text-turquoise-300'
                            : 'bg-darkBlue-700/30 text-lightBlue-100/50 hover:bg-darkBlue-700/50'
                        }
                      `}
                    >
                      <span className="relative z-10">{date.getDate()}</span>
                      {day.completed && (
                        <motion.div
                          className="absolute inset-0 bg-turquoise-400/10 rounded-lg"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.02 + 0.3 }}
                        />
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
                        <div className="bg-darkBlue-800 text-lightBlue-100 text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                          {date.toLocaleDateString(undefined, { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Enhanced Achievements */}
            {streakStats.achievements.length > 0 && (
              <motion.div variants={variants.item} className="mt-6">
                <h4 className="text-teal-200 font-medium mb-4">Achievements</h4>
                <div className="grid gap-3">
                  {streakStats.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      variants={variants.fadeInScale}
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 transform group-hover:scale-105 transition-transform duration-300" />
                      <div className="relative flex items-center space-x-3 bg-darkBlue-700/30 p-4 rounded-lg border border-yellow-400/20">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                          <span className="text-2xl">{achievement.icon}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-yellow-400 font-medium">{achievement.title}</p>
                          <p className="text-sm text-lightBlue-100/70">{achievement.description}</p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.2 }}
                          className="absolute top-2 right-2"
                        >
                          <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16a1 1 0 11-2 0V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 013 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L7 4.323V3a1 1 0 011-1h2z" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakTracker;
