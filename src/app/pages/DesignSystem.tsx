import React, { useState } from 'react';
import { Palette, Type, Layout, MousePointer2, Smartphone, Moon, Sun, Cat, Star } from 'lucide-react';
import { MobileWrapper } from '../components/MobileWrapper';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';
import * as Icons from '../components/icons';

export default function DesignSystem() {
  const [activeTab, setActiveTab] = useState('icons'); // Default to icons for now as user is focusing on it

  const tabs = [
    { id: 'foundations', label: 'Foundations', icon: Palette },
    { id: 'components', label: 'Components', icon: Layout },
    { id: 'inputs', label: 'Inputs', icon: MousePointer2 },
    { id: 'icons', label: 'Icons', icon: Star },
  ];

  return (
    <MobileWrapper>
      <div className="flex flex-col min-h-full bg-neutral-50 pb-20">
        
        {/* Header */}
        <header className="px-6 pt-12 pb-6 bg-white sticky top-0 z-10 border-b border-neutral-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
              <Cat size={18} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">MeowUI System</h1>
          </div>
          <p className="text-sm text-neutral-500">Mobile Design Foundation v0.1</p>
        </header>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Navigation Tabs */}
          <div className="flex p-1 bg-neutral-200/50 rounded-xl overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm text-neutral-900' 
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            
            {activeTab === 'foundations' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-neutral-400">Typography Scale</h3>
                  <div className="space-y-2 border-l-2 border-neutral-200 pl-4">
                    <h1 className="text-4xl font-bold">Display H1</h1>
                    <h2 className="text-2xl font-bold">Heading H2</h2>
                    <h3 className="text-xl font-semibold">Heading H3</h3>
                    <p className="text-base">Body Text - The quick brown fox jumps over the lazy dog.</p>
                    <p className="text-sm text-neutral-500">Caption Text - Small details and metadata.</p>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-neutral-400">Brand Colors</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-2xl bg-blue-500 p-3 text-white flex flex-col justify-end shadow-sm">
                      <span className="text-xs font-medium">Primary</span>
                      <span className="text-xs opacity-70">#3B82F6</span>
                    </div>
                    <div className="h-24 rounded-2xl bg-neutral-900 p-3 text-white flex flex-col justify-end shadow-sm">
                      <span className="text-xs font-medium">Neutral</span>
                      <span className="text-xs opacity-70">#171717</span>
                    </div>
                    <div className="h-24 rounded-2xl bg-rose-500 p-3 text-white flex flex-col justify-end shadow-sm">
                      <span className="text-xs font-medium">Accent</span>
                      <span className="text-xs opacity-70">#F43F5E</span>
                    </div>
                    <div className="h-24 rounded-2xl bg-emerald-500 p-3 text-white flex flex-col justify-end shadow-sm">
                      <span className="text-xs font-medium">Success</span>
                      <span className="text-xs opacity-70">#10B981</span>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'components' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-neutral-400">Buttons</h3>
                  <div className="flex flex-col gap-3">
                    <Button size="lg" className="w-full">Primary Action</Button>
                    <Button variant="secondary" size="lg" className="w-full">Secondary Action</Button>
                    <Button variant="outline" size="lg" className="w-full">Outline Action</Button>
                    <Button variant="ghost" size="lg" className="w-full">Ghost Action</Button>
                    <div className="flex gap-2">
                       <Button size="icon" className="rounded-full"><Cat size={20}/></Button>
                       <Button size="icon" variant="secondary" className="rounded-full"><Sun size={20}/></Button>
                       <Button size="icon" variant="outline" className="rounded-full"><Moon size={20}/></Button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-neutral-400">Cards</h3>
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Card</CardTitle>
                      <CardDescription>A standard container for mobile content.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400 text-sm">
                        Placeholder Content
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button size="sm" className="w-full">Action</Button>
                    </CardFooter>
                  </Card>
                </section>
              </motion.div>
            )}

            {activeTab === 'inputs' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                 <section className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                    <Input placeholder="name@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Password</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                     <label className="text-sm font-medium mb-1.5 block">Search</label>
                     <div className="relative">
                        <Input placeholder="Search items..." className="pl-10" />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                           <MousePointer2 size={16} />
                        </div>
                     </div>
                  </div>
                 </section>
              </motion.div>
            )}

            {activeTab === 'icons' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <section>
                  <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-neutral-400">System Icons</h3>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {/* Automatically render all exported icons */}
                    {Object.entries(Icons).map(([name, IconComponent]) => {
                         // Skip default export or non-component exports if any
                         if (name === 'default' || typeof IconComponent !== 'function') return null;
                         
                         return (
                            <div key={name} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-neutral-100 aspect-square hover:bg-neutral-50 transition-colors">
                                {/* @ts-ignore - Dynamic component rendering */}
                                <IconComponent className="w-6 h-6 text-neutral-900 mb-2" />
                                <span className="text-[9px] text-neutral-500 text-center break-all leading-tight">
                                  {name.replace('Icon', '')}
                                </span>
                            </div>
                         );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

          </div>

          <div className="h-10"></div> {/* Bottom spacer */}
        </div>

        {/* Floating Bottom Bar (Example of Sticky UI) */}
        <div className="fixed bottom-10 left-0 right-0 px-6 pointer-events-none sm:absolute sm:bottom-6">
           <div className="bg-black/80 backdrop-blur-md text-white p-4 rounded-full shadow-2xl flex items-center justify-between pointer-events-auto max-w-[340px] mx-auto">
              <span className="text-sm font-medium pl-2">System Status</span>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-xs text-neutral-300">Live Preview</span>
              </div>
           </div>
        </div>

      </div>
    </MobileWrapper>
  );
}
