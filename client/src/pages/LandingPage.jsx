import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { features, FooterLink, inputTypes } from "@/helper";
import {
  ArrowRight,
  Brain,
  Github,
  Linkedin,
  Mail,
  Twitter,
  ChevronRight
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const LandingPage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  
  const code = `function addTwoNumbers(a, b) {
    return a + b
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let inputLines = [];

rl.on('line', (line) => {
    inputLines = line.split(' ');
    rl.close();
}).on('close', () => {
    const a = parseInt(inputLines[0], 10);
    const b = parseInt(inputLines[1], 10);
    console.log(addTwoNumbers(a, b));
});`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-500/20 via-transparent to-transparent opacity-50 blur-3xl"></div>
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-50"></div>
        {/* Added a subtle grid effect that fades out at the bottom */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxwYXRoIGQ9Ik0gMjQgMEwgMCAwIDAgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] bg-repeat [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-40"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-6 sm:pt-40 sm:pb-24">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 shadow-xl shadow-blue-900/20 backdrop-blur-md">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-slate-300">
                  Join LeetLabs built for real-world problem solvers
                </span>
              </div>
            </div>
            
            <h1 className="animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight pb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                A platform to
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-400 to-green-400">
                master coding
              </span>
            </h1>

            <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Solve challenges, level up your skills, and stand out. Dive into a
              clean, powerful coding experience made for true developers.
            </p>
            
            <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <Button
                className="group relative px-8 py-6 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => navigate(authUser ? "/dashboard" : "/signup")}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-lg border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 backdrop-blur-md rounded-xl transition-all cursor-pointer"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        {/* Code Block & Features Section */}
        <div id="features" className="px-6 py-20 bg-slate-950/50 backdrop-blur-sm border-y border-slate-800/50 relative">
          <div className="max-w-6xl mx-auto space-y-24">
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-b from-slate-700 to-slate-900/50 shadow-2xl shadow-blue-900/20 transition-all hover:shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"></div>
              <div className="relative rounded-xl overflow-hidden bg-slate-950">
                <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-slate-900/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="ml-4 text-xs font-medium text-slate-500 font-mono">Challenge.js</div>
                </div>
                <div className="p-4 bg-black/40">
                    <CodeBlock
                      language="jsx"
                      filename="Challenge.js"
                      highlightLines={[9, 13, 14, 18]}
                      code={code}
                    />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group bg-slate-900/40 border-slate-800/60 hover:border-blue-500/50 hover:bg-slate-800/40 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-8 flex flex-col items-start text-left space-y-4">
                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-xl text-slate-100 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-12 bg-slate-950">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto gap-6">
            <p className="text-slate-500 text-sm">
              © 2025 <span className="font-medium text-slate-300">Amaan Patel</span>
              . All rights reserved.
            </p>
            <div className="flex gap-6 justify-center">
              <FooterLink
                href="https://github.com/amaanpatell"
                icon={<Github className="w-5 h-5 transition-transform hover:scale-110 text-slate-400 hover:text-slate-200" />}
                label="GitHub"
              />
              <FooterLink
                href="https://www.linkedin.com/in/amaan-patel-8251061a1/"
                icon={<Linkedin className="w-5 h-5 transition-transform hover:scale-110 text-slate-400 hover:text-slate-200" />}
                label="LinkedIn"
              />
              <FooterLink
                href="https://x.com/amaanpatelll"
                icon={<Twitter className="w-5 h-5 transition-transform hover:scale-110 text-slate-400 hover:text-slate-200" />}
                label="X (Twitter)"
              />
              <FooterLink
                href="mailto:amaanp32@gmail.com"
                icon={<Mail className="w-5 h-5 transition-transform hover:scale-110 text-slate-400 hover:text-slate-200" />}
                label="Mail"
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
