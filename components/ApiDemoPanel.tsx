import React, { useRef, useState } from 'react';
import { useSpacespotDemo } from '../src/useApiDemo';
import type { UseSpacespotDemo, Unit } from '../src/types';
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export default function ApiDemoPanel() {
  const {
    user, units, token, error, signup, login, fetchMe, createDemoUnits, fetchUnits, uploadDemoFile, logout, updateUnit, deleteUnit
  }: UseSpacespotDemo = useSpacespotDemo();
  const [form, setForm] = useState<{ email: string; password: string; name: string }>({ email: '', password: '', name: '' });
  const [spaceId, setSpaceId] = useState<string>('SP001');
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 10, background: '#fff' }}>
      <Toaster position="top-center" richColors />
      <h2>API Demo Panel</h2>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {user ? (
        <>
          <div>Logged in as <b>{user.email}</b> ({user.role})</div>
          <button onClick={logout} style={{ margin: '8px 0' }}>Logout</button>
        </>
      ) : (
        <>
          <input placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={{ width: '100%', marginBottom: 4 }} />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ width: '100%', marginBottom: 4 }} />
          <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', marginBottom: 4 }} />
          <button onClick={() => signup(form.email, form.password, form.name)} style={{ marginRight: 8 }}>Sign Up</button>
          <button onClick={() => login(form.email, form.password)}>Login</button>
        </>
      )}
      <hr style={{ margin: '16px 0' }} />
      <button onClick={fetchMe} disabled={!token}>Fetch Me</button>
      <div style={{ margin: '8px 0' }}>
        <input placeholder="Space ID" value={spaceId} onChange={e => setSpaceId(e.target.value)} style={{ width: '60%' }} />
        <button onClick={() => createDemoUnits(spaceId)} disabled={!token} style={{ marginLeft: 8 }}>Create Demo Units</button>
        <button onClick={() => fetchUnits(spaceId)} disabled={!token} style={{ marginLeft: 8 }}>Fetch Units</button>
      </div>
      <ul>
        {units.map((u: Unit) => (
          <li key={u.id}>
            {u.name} ({u.type}, {u.area} sqm, {u.status})
            <button
              style={{ marginLeft: 8 }}
              onClick={async () => {
                const newName = prompt('New name for unit:', u.name);
                if (newName) {
                  try {
                    await updateUnit(u.id, { name: newName });
                    toast.success('Unit updated successfully');
                  } catch (err: any) {
                    toast.error('Failed to update unit');
                  }
                }
              }}
              disabled={!token}
            >Update</button>
            <button
              style={{ marginLeft: 4, color: 'red' }}
              onClick={async () => {
                if (window.confirm('Delete this unit?')) {
                  try {
                    await deleteUnit(u.id);
                    toast.success('Unit deleted successfully');
                  } catch (err: any) {
                    toast.error('Failed to delete unit');
                  }
                }
              }}
              disabled={!token}
            >Delete</button>
          </li>
        ))}
      </ul>
      <hr style={{ margin: '16px 0' }} />
      <input type="file" ref={fileInput} />
      <button onClick={async () => {
        if (fileInput.current && fileInput.current.files && fileInput.current.files[0]) {
          try {
            const url = await uploadDemoFile(fileInput.current.files[0]);
            setFileUrl(url);
            toast.success('File uploaded successfully');
          } catch (err: any) {
            toast.error('File upload failed');
          }
        }
      }} disabled={!token}>Upload File</button>
      {fileUrl && <div>File uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></div>}
    </div>
  );
}
