'use client';

import { useState } from 'react';
import { Edit2, Trash2, Eye, Search } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: any[];
    onView?: (item: any) => void;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
    searchable?: boolean;
    emptyMessage?: string;
}

export default function DataTable({
    columns,
    data,
    onView,
    onEdit,
    onDelete,
    searchable = false,
    emptyMessage = 'No data available',
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = searchable
        ? data.filter((item) =>
              Object.values(item).some((value) =>
                  String(value)
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()),
              ),
          )
        : data;

    return (
        <div className="space-y-4">
            {searchable && (
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-primary rounded-xl focus:ring-2 focus:ring-dark-primary/20 focus:border-dark-primary outline-none transition-all"
                    />
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-primary/50 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary border-b border-primary/50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className="px-6 py-4 text-left text-xs font-bold text-neutral-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                                {(onView || onEdit || onDelete) && (
                                    <th className="px-6 py-4 text-center text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/30 bg-white">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={columns.length + 1}
                                        className="px-6 py-12 text-center text-neutral-500"
                                    >
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-secondary/30 transition-colors"
                                    >
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="px-6 py-4 text-sm text-neutral-900"
                                            >
                                                {column.render
                                                    ? column.render(
                                                          item[column.key],
                                                          item,
                                                      )
                                                    : item[column.key]}
                                            </td>
                                        ))}
                                        {(onView || onEdit || onDelete) && (
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {onView && (
                                                        <button
                                                            onClick={() =>
                                                                onView(item)
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {onEdit && (
                                                        <button
                                                            onClick={() =>
                                                                onEdit(item)
                                                            }
                                                            className="p-2 text-dark-primary hover:bg-primary rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() =>
                                                                onDelete(item)
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredData.length > 0 && (
                <div className="text-sm text-neutral-500 text-center">
                    Showing {filteredData.length} of {data.length}{' '}
                    {data.length === 1 ? 'item' : 'items'}
                </div>
            )}
        </div>
    );
}
