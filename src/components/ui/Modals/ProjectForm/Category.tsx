import type { Project } from "../../../../types/project";

export default function Category({
    newProject,
    setNewProject,
}: {
    newProject: Partial<Project>;
    setNewProject: (project: Partial<Project>) => void;
}) {
    return (
        <select
            value={newProject.category || ["sensors"]}
            multiple
            onChange={(e) =>
                setNewProject({
                    ...newProject,
                    category: Array.from(
                        e.target.selectedOptions,
                        (option) => option.value,
                    ) as Project["category"],
                })
            }
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
        >
            <option value="embedded_systems">Embedded Systems</option>
            <option value="iot">IoT</option>
            <option value="robotics">Robotics</option>
            <option value="web_development">Web Development</option>
            <option value="mobile_development">Mobile Development</option>
            <option value="data_processing">Data Processing</option>
            <option value="sensors">Sensors</option>
            <option value="connectivity">Connectivity</option>
            <option value="power_supply">Power Supply</option>
            <option value="actuators">Actuators</option>
            <option value="display">Display</option>
            <option value="automation">Automation</option>
            <option value="other">Other</option>
        </select>
    );
}
