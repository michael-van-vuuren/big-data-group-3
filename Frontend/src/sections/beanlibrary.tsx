import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'


interface BeanLibraryProps {
    subcategories: string[];
}

export default function BeanLibrary({ subcategories }: BeanLibraryProps) {
    return (
        <div className="overflow-scroll p-1 m-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[300px]">Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subcategories.slice().reverse().map((subcategories) => (
                        <TableRow key={subcategories}>
                            <TableCell className="font-base">{subcategories}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
