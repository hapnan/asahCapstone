import { Button } from "@/components/ui/button";
import { IconGripVertical } from "@tabler/icons-react";
import { useSortable } from "@dnd-kit/sortable";

export function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}
