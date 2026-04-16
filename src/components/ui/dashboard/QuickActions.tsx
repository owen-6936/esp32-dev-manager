import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Code, FileText, Package } from "lucide-react";
import Card from "../../Card";
import ListButton from "../../ListButton";
import AddJournal from "../Modals/AddJournal";
import CodeEditor from "../Modals/CodeEditor";

export default function QuickActions() {
    const navigate = useNavigate();
    const [showAddJournal, setShowAddJournal] = useState(false);
    const [showCodeEditor, setShowCodeEditor] = useState(false);

    return (
        <>
            <Card key={0} index={0}>
                <Card.Header title="Quick Actions" />
                <Card.Body className="grid grid-cols-1 gap-4">
                    <ListButton
                        icon={<FileText />}
                        text="Add Journal Entry"
                        onClick={() => setShowAddJournal(true)}
                    />
                    <ListButton
                        icon={<Package />}
                        text="Manage Inventory"
                        onClick={() => navigate("/workshop?tab=components")}
                        bgColor="bg-green-500/20"
                        hoverBgColor="hover:bg-green-400/30"
                    />
                    <ListButton
                        icon={<Code />}
                        text="Add Code Snippet"
                        onClick={() => setShowCodeEditor(true)}
                        bgColor="bg-purple-500/20"
                        hoverBgColor="hover:bg-purple-400/30"
                    />
                </Card.Body>
            </Card>

            {showAddJournal && (
                <AddJournal setShowAddJournal={setShowAddJournal} />
            )}
            {showCodeEditor && (
                <CodeEditor setShowCodeEditor={setShowCodeEditor} />
            )}
        </>
    );
}
