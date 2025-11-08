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
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
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
    <div className=" text-white ">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="relative px-6 py-10">
          <div className="max-w-7xl  mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/20 border border-blue-600/20">
              <Brain className="w-4 h-4 text-neutral-100" />
              <span className="text-sm font-medium text-neutral-100">
                Join LeetLabs built for real-world problem solvers
              </span>
            </div>
            <h1 className="text-4xl h-22 sm:text-6xl md:text-7xl font-semibold tracking-tight mt-5 bg-linear-to-r from-blue-500 via-teal-400 to-green-400 bg-clip-text text-transparent">
              A platform to master coding
            </h1>

            <p className="text-lg text-neutral-400 max-w-5xl px-1 mx-auto leading-relaxed -mt-2">
              Solve challenges, level up your skills, and stand out. Dive into a
              clean, powerful coding experience made for true developers.
            </p>
            <div className="flex justify-center items-center gap-2 mt-10">
              <Button
                className=" px-5 py-6 text-lg cursor-pointer bg-transparent border border-neutral-300 text-neutral-100 hover:bg-neutral-100 hover:text-neutral-900"
                onClick={() => navigate("/dashboard")}
              >
                Get Started
                <ArrowRight />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 ">
        <div className="max-w-6xl mx-auto">
          <CodeBlock
            language="jsx"
            filename="Challenge.js"
            highlightLines={[9, 13, 14, 18]}
            code={code}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-neutral-900/10 border-neutral-800 hover:bg-neutral-800/20 transition-colors"
              >
                <CardContent className="px-2 py-2 flex flex-col justify-center items-center text-center space-y-3">
                  {feature.icon}
                  <h3 className="font-semibold text-base text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-base">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* <SupportedInputs inputTypes={inputTypes} /> */}
      <footer className="border border-neutral-700 px-6 py-10 text-center text-sm bg-transparent text-zinc-400">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-4">
          <p className="text-zinc-500 text-sm">
            © 2025 <span className="font-semibold text-white">Amaan Patel</span>
            . All rights reserved.
          </p>
          <div className="flex gap-5 justify-center">
            <FooterLink
              href="https://github.com/amaanpatell"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
            />
            <FooterLink
              href="https://www.linkedin.com/in/amaan-patel-8251061a1/"
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
            />
            <FooterLink
              href="https://x.com/amaanpatelll"
              icon={<Twitter className="w-5 h-5" />}
              label="X (Twitter)"
            />
            <FooterLink
              href="mailto:amaanp32@gmail.com"
              icon={<Mail className="w-5 h-5" />}
              label="Mail"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
