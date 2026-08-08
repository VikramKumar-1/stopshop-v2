import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { MarkdownHelpGuide } from "./MarkdownHelpGuide";

export function CMSContentSettings({ settings, setSettings, savingSettings, handleSave }: { settings: any, setSettings: any, savingSettings: boolean, handleSave: (e: React.FormEvent) => void }) {
  
  const handleAddContact = () => {
    const newContacts = [...(settings.footerContacts || []), { id: Date.now().toString(), type: "phone", value: "", isVisible: true }];
    setSettings({ ...settings, footerContacts: newContacts });
  };
  
  const handleUpdateContact = (index: number, field: string, value: any) => {
    const newContacts = [...(settings.footerContacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setSettings({ ...settings, footerContacts: newContacts });
  };
  
  const handleRemoveContact = (index: number) => {
    const newContacts = [...(settings.footerContacts || [])];
    newContacts.splice(index, 1);
    setSettings({ ...settings, footerContacts: newContacts });
  };

  const handleAddSocial = () => {
    const newSocials = [...(settings.footerSocialLinks || []), { id: Date.now().toString(), name: "", url: "", isVisible: true }];
    setSettings({ ...settings, footerSocialLinks: newSocials });
  };
  
  const handleUpdateSocial = (index: number, field: string, value: any) => {
    const newSocials = [...(settings.footerSocialLinks || [])];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setSettings({ ...settings, footerSocialLinks: newSocials });
  };
  
  const handleRemoveSocial = (index: number) => {
    const newSocials = [...(settings.footerSocialLinks || [])];
    newSocials.splice(index, 1);
    setSettings({ ...settings, footerSocialLinks: newSocials });
  };

  return (
    <form onSubmit={handleSave} className="bg-surface-card border border-border rounded-3xl p-6 md:p-8 space-y-8 mt-8">
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
        <h2 className="text-lg font-bold text-heading">CMS & Content (Footer & Pages)</h2>
      </div>

      {/* Export Program Content */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-heading">Export Program Page</h3>
        <MarkdownHelpGuide />
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Page Content (Markdown Supported)</label>
          <textarea 
            value={settings.exportProgramContent || ""} 
            onChange={e => setSettings({...settings, exportProgramContent: e.target.value})} 
            placeholder="Write details about the export program..."
            rows={6}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <p className="text-[10px] text-muted">This text will be displayed publicly on the /export-program page.</p>
        </div>
      </div>

      <hr className="border-border" />

      {/* Footer Content */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-heading">Footer Details</h3>
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted">About Text</label>
          <textarea 
            value={settings.footerAboutText || ""} 
            onChange={e => setSettings({...settings, footerAboutText: e.target.value})} 
            rows={3}
            className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-heading focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* Contacts */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Contact Info (Phone, Email, Address)</label>
            <button type="button" onClick={handleAddContact} className="text-[10px] font-bold uppercase text-purple-500 hover:text-purple-600 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-md">
              <Plus size={12} /> Add Contact
            </button>
          </div>
          <div className="space-y-2">
            {(settings.footerContacts || []).map((contact: any, index: number) => (
              <div key={contact.id || index} className="flex gap-2 items-center bg-surface p-2 rounded-xl border border-border">
                <select 
                  value={contact.type} 
                  onChange={e => handleUpdateContact(index, "type", e.target.value)}
                  className="bg-transparent border border-border rounded-lg text-xs px-2 py-1.5 focus:outline-none"
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="address">Address</option>
                </select>
                <input 
                  type="text" 
                  value={contact.value} 
                  onChange={e => handleUpdateContact(index, "value", e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="flex-1 bg-transparent border border-border rounded-lg text-xs px-3 py-1.5 focus:outline-none"
                />
                <label className="flex items-center gap-1 text-[10px] text-muted">
                  <input type="checkbox" checked={contact.isVisible} onChange={e => handleUpdateContact(index, "isVisible", e.target.checked)} /> Show
                </label>
                <button type="button" onClick={() => handleRemoveContact(index)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted">Social Links</label>
            <button type="button" onClick={handleAddSocial} className="text-[10px] font-bold uppercase text-purple-500 hover:text-purple-600 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded-md">
              <Plus size={12} /> Add Social Link
            </button>
          </div>
          <div className="space-y-2">
            {(settings.footerSocialLinks || []).map((social: any, index: number) => (
              <div key={social.id || index} className="flex flex-wrap sm:flex-nowrap gap-2 items-center bg-surface p-2 rounded-xl border border-border">
                <input 
                  type="text" 
                  value={social.name} 
                  onChange={e => handleUpdateSocial(index, "name", e.target.value)}
                  placeholder="Platform (e.g. Instagram)"
                  className="w-1/3 min-w-[100px] bg-transparent border border-border rounded-lg text-xs px-3 py-1.5 focus:outline-none"
                />
                <input 
                  type="text" 
                  value={social.url} 
                  onChange={e => handleUpdateSocial(index, "url", e.target.value)}
                  placeholder="URL (e.g. https://...)"
                  className="flex-[2] min-w-[150px] bg-transparent border border-border rounded-lg text-xs px-3 py-1.5 focus:outline-none"
                />
                <label className="flex items-center gap-1 text-[10px] text-muted">
                  <input type="checkbox" checked={social.isVisible} onChange={e => handleUpdateSocial(index, "isVisible", e.target.checked)} /> Show
                </label>
                <button type="button" onClick={() => handleRemoveSocial(index)} className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button type="submit" disabled={savingSettings} className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50">
          {savingSettings ? "Saving..." : "Save Content"}
        </button>
      </div>
    </form>
  );
}
