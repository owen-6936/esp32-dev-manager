import type { Project } from "../../types/project";
import Card from "../Card";
import StatusItem from "../StatusItem";

export default function Analytics() {
  const projects: Project[] = [];
  const stats = {
    budgetUsed: projects.reduce(
      (accumulator, project) => accumulator + (project.budget ?? 0),
      0
    ),
    timeSpent: projects.reduce(
      (accumulator, project) => accumulator + (project.timeSpent ?? 0),
      0
    ),
  };
  return (
    <div className="space-y-6 min-height p-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white">
        Project Analytics
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card index={1}>
          <Card.Header title="Project Status" />
          <Card.Body>
            <StatusItem count={10} percentage={100} status="completed" />
            <StatusItem count={5} percentage={50} status="in-progress" />
            <StatusItem count={3} percentage={30} status="planning" />
            <StatusItem count={2} percentage={20} status="on-hold" />
          </Card.Body>
        </Card>

        <Card index={2}>
          <Card.Header title="Time vs Budget Analysis" />
          <Card.Body className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(
                  (stats.budgetUsed /
                    (projects.reduce(
                      (accumulator, project) =>
                        accumulator + (project.budget ?? 0),
                      0
                    ) || 1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-blue-200 text-sm">Budget Efficiency</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">
                {(
                  (stats.timeSpent /
                    (projects.reduce(
                      (accumulator, project) =>
                        accumulator + (project.estimatedTime ?? 0),
                      0
                    ) || 1)) *
                  100
                ).toFixed(1)}
                %
              </div>
              <p className="text-blue-200 text-sm">Time Efficiency</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
