import { Button } from "@/components/ui/button";
import { getNoteColor } from "@/lib/colorutils";

interface SubcategoriesProps {
    notes: string[];
    selected: string[];
    toggle: (note: string) => void;
}

export default function Subcategories({ notes, selected, toggle }: SubcategoriesProps) {
    return (
        <div className="grid grid-cols-3 gap-3 mx-2 mb-2">
            {notes.map((note) => {
                const isSelected = selected.includes(note);
                return (
                    <div key={note} className="flex items-center gap-2">
                        <Button
                            variant="round"
                            size="icon"
                            color={getNoteColor(note)}
                            activeSm={isSelected}
                            onClick={() => toggle(note)}
                            className="relative"
                        >
                            {isSelected && (
                                <>
                                    <span className="absolute w-4 h-4 bg-white rounded-full"></span>
                                    <span className="absolute w-2/4 h-1 bg-black rounded-full"></span>
                                </>
                            )}
                        </Button>
                        <p className="text-sm">{note}</p>
                    </div>
                );
            })}
        </div>
    );
}
