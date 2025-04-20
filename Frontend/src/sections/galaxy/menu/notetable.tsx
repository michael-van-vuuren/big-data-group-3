import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table'
import { toTitleCase, toCompressedForm } from '@/lib/utils/stringutils';
import { Button } from '@/components/button';


interface NoteTableProps {
    subcategories: string[];
    onRemoveNote: (note: string) => void;
}

export default function NoteTable({ subcategories, onRemoveNote }: NoteTableProps) {
    return (
        <div className="border-none">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]"> Selected Notes</TableHead>
                        <TableHead className="w-[50px] text-right pr-4">Remove</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subcategories.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={2} className="h-12 text-center text-md text-white">
                                No notes selected.
                            </TableCell>
                        </TableRow>
                    ) : (
                        subcategories.slice().reverse().map((note) => (
                            <TableRow key={note}>
                                <TableCell className="font-base py-2">
                                    {toTitleCase(toCompressedForm(note))}
                                </TableCell>
                                <TableCell className="text-right py-1 pr-2 h-12">
                                    {/* Remove button */}
                                    <Button
                                            variant="noShadow"
                                            size="icon"
                                            onClick={() => onRemoveNote(note)}
                                            className=" bg-white border-black text-black hover:bg-red-500"
                                            aria-label="Close product view"
                                          >
                                            <span className="text-xl font-semibold leading-none">&times;</span>
                                          </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}


