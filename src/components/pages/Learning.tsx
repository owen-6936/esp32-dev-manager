import type { LearningGoal, LearningMetric } from "../../types/Learning";
import Card from "../Card";

export default function Learning() {
  const learningMetrics: LearningMetric[] = [];
  const learningGoals: LearningGoal[] = [];
  return (
    <div className="space-y-6 min-height p-6">
      <h2 className="text-3xl font-bold text-white">Learning Progress</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card index={0}>
          <Card.Header>Skill Development</Card.Header>
          <Card.Body className="space-y-4">
            {learningMetrics.map((metric, index) => {
              const percentage = (metric.completed / metric.total) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">
                      {metric.category}
                    </span>
                    <span className="text-blue-200 text-sm">
                      {metric.completed}/{metric.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`${metric.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </Card.Body>
        </Card>

        <Card index={1}>
          <Card.Header>Learning Goals</Card.Header>
          <Card.Body className="space-y-4">
            {learningGoals.map(
              ({ icon: Icon, category, description }, index) => (
                <div
                  key={category || index}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    {Icon}
                    <h4 className="text-white font-semibold">{category}</h4>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">{description}</p>
                  <div className="w-full bg-white/10 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full w-3/5"></div>
                  </div>
                </div>
              )
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
