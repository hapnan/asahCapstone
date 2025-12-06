import { DataTable } from '@/components/data-table/dataTable';
import data from './data.json';

export default function TasksPage() {
    return (
        <div className='flex flex-1 flex-col'>
            <DataTable data={data} />
        </div>
    );
}
