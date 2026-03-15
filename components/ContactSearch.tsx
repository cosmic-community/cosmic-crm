'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export default function ContactSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const updateUrl = useCallback(
    (newSearch: string, newStatus: string) => {
      const params = new URLSearchParams();
      if (newSearch) params.set('q', newSearch);
      if (newStatus) params.set('status', newStatus);
      const qs = params.toString();
      router.push(`/contacts${qs ? `?${qs}` : ''}`);
    },
    [router]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateUrl(search, status);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, status, updateUrl]);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          placeholder="Search contacts by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="input-field w-full sm:w-44"
      >
        <option value="">All Statuses</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Lead">Lead</option>
        <option value="Prospect">Prospect</option>
        <option value="Customer">Customer</option>
        <option value="Churned">Churned</option>
      </select>
    </div>
  );
}