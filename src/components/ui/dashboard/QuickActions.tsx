import { Code, FileText, Package } from "lucide-react";
import Card from "../../Card";
import ListButton from "../../ListButton";

export default function QuickActions() {
  return (
    <Card key={0} index={0}>
      <Card.Header title="Quick Actions" />
      <Card.Body className="grid grid-cols-1 gap-4">
        <ListButton
          icon={<FileText />}
          text="Add Journal Entry"
          // TODO: Implement Add Journal Entry functionality
          onClick={() => {
            // TODO: Open add journal entry modal
          }}
        />
        <ListButton
          icon={<Package />}
          text="Manage Inventory"
          // TODO: Implement Manage Inventory functionality
          onClick={() => {
            // TODO: Open manage inventory modal
          }}
          bgColor="bg-green-500/20"
          hoverBgColor="hover:bg-green-400/30"
        />
        <ListButton
          icon={<Code />}
          text="Add Code Snippet"
          // TODO: Implement Add Code Snippet functionality
          onClick={() => {
            // TODO: Open add code snippet modal
          }}
          bgColor="bg-purple-500/20"
          hoverBgColor="hover:bg-purple-400/30"
        />
      </Card.Body>
    </Card>
  );
}
