import type { StatProps } from "../../../types/account/stats";
import Card from "../../Card";
import { stats } from "../../../constants/account";
import StatCard from "../../statCard";
import { TrendingUp } from "lucide-react";

export default function Stats({
  totalProjects,
  completedProjects,
  totalComponents,
  timeSpent,
  streakDays,
  achievements,
}: StatProps) {
  return (
    <Card bg="transparent" padding="px-4 py-4">
      <Card.Header
        title="Progress Overview"
        icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
        subtitle="Overview of your progress"
      />
      <Card.Body>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats({
            totalProjects,
            completedProjects,
            totalComponents,
            timeSpent,
            streakDays,
            achievements,
          }).map(
            (
              {
                title,
                icon: Icon,
                iconColor,
                iconBg,
                subtitle,
                subtitleColor,
                subtitleIcon: SubtitleIcon,
                value,
              },
              index
            ) => (
              <StatCard
                key={title}
                title={title}
                index={index}
                value={value}
                icon={<Icon className={`w-4 h-4 ${iconColor}`} />}
                iconBg={iconBg}
                subtitle={subtitle}
                subtitleIcon={
                  <SubtitleIcon className={`w-4 h-4 ${subtitleColor}`} />
                }
              />
            )
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
