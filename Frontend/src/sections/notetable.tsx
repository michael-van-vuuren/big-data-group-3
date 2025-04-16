import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { toTitleCase, toCompressedForm } from '@/lib/stringutils';


interface NoteTableProps {
    subcategories: string[];
}

export default function NoteTable({ subcategories }: NoteTableProps) {
    return (
        <div className="border-none">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]"> Selected Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subcategories.slice().reverse().map((subcategories) => (
                        <TableRow key={subcategories}>
                            <TableCell className="font-base">{toTitleCase(toCompressedForm(subcategories))}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}


