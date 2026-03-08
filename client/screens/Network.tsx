import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { AppLayout } from '../components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  Linkedin, 
  Github, 
  Globe, 
  Twitter, 
  TrendingUp,
  Share2,
  Mail,
  Phone,
  MoreVertical,
  Briefcase,
  Target,
  UserPlus,
  Calendar,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useStrategicScore } from '../hooks/useStrategicScore';
import { Peer } from '../types';

const growthData = [
  { date: 'Jan', count: 120 },
  { date: 'Feb', count: 240 },
  { date: 'Mar', count: 210 },
  { date: 'Apr', count: 350 },
  { date: 'May', count: 480 },
  { date: 'Jun', count: 520 },
];

const NetworkScreen = () => {
  const { peers, addPeer, deletePeer } = useStore();
  const { finalScore, networkStrength } = useStrategicScore();
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState<Peer | null>(null);

  // Pagination and filtering
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const filteredPeers = useMemo(() => {
    return peers.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.role?.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase())
    );
  }, [peers, search]);

  const displayedPeers = filteredPeers.slice(0, page * itemsPerPage);

  // Form State for Adding
  const [newPeer, setNewPeer] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    linkedin: '',
    twitter: '',
    github: '',
    website: '',
    notes: '',
    tags: [] as string[],
  });

  const handleAddPeer = () => {
    if (!newPeer.name) return;
    addPeer({
      ...newPeer,
      tags: newPeer.tags.length > 0 ? newPeer.tags : ['Network']
    });
    setNewPeer({
      name: '',
      role: '',
      company: '',
      email: '',
      phone: '',
      linkedin: '',
      twitter: '',
      github: '',
      website: '',
      notes: '',
      tags: [],
    });
    setIsAddOpen(false);
  };

  return (
    <AppLayout>
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Network</h1>
          <p className="text-slate-500 font-medium italic">Automatic strategic influence</p>
        </div>
        <div className="flex flex-col items-end">
           <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Global Score</p>
           <p className="text-3xl font-black text-slate-900">{finalScore}</p>
        </div>
      </header>

      {/* Analytics Section */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="rounded-[2.5rem] border-none bg-indigo-600 text-white p-6 flex flex-col justify-between shadow-xl shadow-indigo-100/50">
           <div>
             <Users className="w-8 h-8 opacity-60 mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Total Peers</p>
             <p className="text-3xl font-black">{peers.length.toLocaleString()}</p>
           </div>
           <p className="text-[10px] font-bold mt-4">+12% growth</p>
        </Card>
        <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl shadow-slate-200">
           <div>
             <Target className="w-8 h-8 text-indigo-400 mb-4" />
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Network Strength</p>
             <p className="text-3xl font-black text-white">{networkStrength}%</p>
           </div>
           <p className="text-[10px] font-bold text-indigo-300 mt-4">Automated Metric</p>
        </Card>
      </div>

      {/* Growth Graph */}
      <section className="mb-8">
        <div className="flex justify-between items-center px-2 mb-4">
          <h3 className="text-lg font-bold text-slate-800">Connection Growth</h3>
        </div>
        <Card className="rounded-[2.5rem] border-none bg-white p-6 shadow-sm border border-slate-100/50 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </section>

      {/* Search and Add */}
      <div className="flex gap-4 mb-8 px-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search connections..." 
            className="pl-11 rounded-2xl border-none bg-white shadow-sm focus-visible:ring-indigo-500 h-14 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <button className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-110 active:scale-95 transition-all">
              <UserPlus className="w-7 h-7" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-2xl overflow-hidden p-0 max-h-[90vh]">
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-2xl font-black text-slate-900">Add Peer</DialogTitle>
              <p className="text-slate-400 font-medium text-sm">Enter professional node details</p>
            </DialogHeader>
            <div className="p-8 pt-6 space-y-5 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <Input id="name" value={newPeer.name} onChange={e => setNewPeer({...newPeer, name: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="e.g. Navin Pandit" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Profession</Label>
                  <Input id="role" value={newPeer.role} onChange={e => setNewPeer({...newPeer, role: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="e.g. CTO" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Company</Label>
                  <Input id="company" value={newPeer.company} onChange={e => setNewPeer({...newPeer, company: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="e.g. Acme Corp" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email</Label>
                  <Input id="email" type="email" value={newPeer.email} onChange={e => setNewPeer({...newPeer, email: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="hello@..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Phone</Label>
                  <Input id="phone" value={newPeer.phone} onChange={e => setNewPeer({...newPeer, phone: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="+1..." />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Social Links (LinkedIn / GitHub / X)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input value={newPeer.linkedin} onChange={e => setNewPeer({...newPeer, linkedin: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="LI ID" />
                  <Input value={newPeer.github} onChange={e => setNewPeer({...newPeer, github: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="GH ID" />
                  <Input value={newPeer.twitter} onChange={e => setNewPeer({...newPeer, twitter: e.target.value})} className="rounded-xl border-slate-100 h-12" placeholder="X ID" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Notes</Label>
                <textarea 
                  id="notes" 
                  value={newPeer.notes} 
                  onChange={e => setNewPeer({...newPeer, notes: e.target.value})}
                  className="w-full min-h-[80px] rounded-xl border border-slate-100 p-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 bg-white"
                  placeholder="Key relationship takeaways..."
                />
              </div>
            </div>
            <DialogFooter className="p-8 pt-0 flex gap-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} className="flex-1 rounded-2xl h-14 font-bold border-slate-100">Cancel</Button>
              <Button onClick={handleAddPeer} className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">Add Connection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Peer List */}
      <div className="space-y-4 pb-24">
        <AnimatePresence>
          {displayedPeers.map((peer, idx) => (
            <motion.div
              key={peer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setSelectedPeer(peer)}
              className="cursor-pointer"
            >
              <Card className="rounded-[2rem] border-none bg-white p-6 shadow-sm border border-slate-100/50 group hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-indigo-400 border border-slate-100 shadow-sm">
                      {peer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{peer.name}</h4>
                      <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tighter">
                        {peer.role || 'Professional'} • {peer.company || 'Org'}
                      </p>
                      
                      <div className="flex gap-3 mt-4">
                        {peer.linkedin && <Linkedin className="w-4 h-4 text-blue-600" />}
                        {peer.github && <Github className="w-4 h-4 text-slate-900" />}
                        {peer.twitter && <Twitter className="w-4 h-4 text-slate-400" />}
                        {peer.website && <Globe className="w-4 h-4 text-indigo-500" />}
                      </div>
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPeers.length > displayedPeers.length && (
          <button 
            onClick={() => setPage(p => p + 1)}
            className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
          >
            Load More Results ({filteredPeers.length - displayedPeers.length} remaining)
          </button>
        )}

        {filteredPeers.length === 0 && (
          <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold italic">No connections found.</p>
          </div>
        )}
      </div>

      {/* Peer Detail Dialog */}
      <Dialog open={!!selectedPeer} onOpenChange={() => setSelectedPeer(null)}>
        <DialogContent className="sm:max-w-md rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden">
          {selectedPeer && (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Users className="w-32 h-32 rotate-12" />
                 </div>
                 <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-3xl font-black mb-6 border border-white/30">
                    {selectedPeer.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <h2 className="text-3xl font-black leading-tight">{selectedPeer.name}</h2>
                 <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mt-2">{selectedPeer.role} • {selectedPeer.company}</p>
              </div>
              <div className="p-8 space-y-8 bg-white flex-1 overflow-y-auto">
                 <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Intelligence</h3>
                    <div className="space-y-3">
                       {selectedPeer.email && (
                         <div className="flex items-center gap-4 text-slate-600 font-bold">
                            <Mail className="w-5 h-5 text-indigo-500" /> {selectedPeer.email}
                         </div>
                       )}
                       {selectedPeer.phone && (
                         <div className="flex items-center gap-4 text-slate-600 font-bold">
                            <Phone className="w-5 h-5 text-indigo-500" /> {selectedPeer.phone}
                         </div>
                       )}
                       <div className="flex gap-4 pt-2">
                          {selectedPeer.linkedin && <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"><Linkedin className="w-5 h-5" /></div>}
                          {selectedPeer.github && <div className="w-10 h-10 bg-slate-50 text-slate-900 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"><Github className="w-5 h-5" /></div>}
                          {selectedPeer.twitter && <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"><Twitter className="w-5 h-5" /></div>}
                          {selectedPeer.website && <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"><Globe className="w-5 h-5" /></div>}
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intelligence Notes</h3>
                    <div className="bg-slate-50 rounded-2xl p-6 text-slate-600 text-sm italic border border-slate-100 leading-relaxed">
                       {selectedPeer.notes || 'No intelligence notes recorded for this node.'}
                    </div>
                 </section>

                 <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Timeline</h3>
                    <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase">
                       <Calendar className="w-4 h-4" /> Added on {new Date(selectedPeer.createdAt).toLocaleDateString()}
                    </div>
                 </section>
              </div>
              <DialogFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                 <Button variant="ghost" onClick={() => { deletePeer(selectedPeer.id); setSelectedPeer(null); }} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold rounded-2xl h-14">Delete Node</Button>
                 <Button onClick={() => setSelectedPeer(null)} className="flex-1 bg-slate-900 text-white font-black uppercase tracking-widest rounded-2xl h-14">Close Profile</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default NetworkScreen;
