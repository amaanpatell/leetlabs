import { Brain, Copy, FileText, Globe, HelpCircle, Search, Sheet, Video, Zap } from "lucide-react";

export const features = [
  {
    icon: <Brain className="w-10 h-10 text-blue-400" />,
    title: "Structured DSA Practice",
    description:
      "Master Data Structures and Algorithms through a well-organized collection.",
  },
  {
    icon: <Search className="w-10 h-10 text-green-400" />,
    title: "Profile Dashboard",
    description:
      "Keep track of your progress and performance with a user-friendly dashboard.",
  },
  {
    icon: <Sheet className="w-10 h-10 text-purple-400" />,
    title: "Practice Sheets",
    description: "Enhance your problem-solving skills with interactive practice sheets.",
  },
  {
    icon: <Zap className="w-10 h-10 text-yellow-400" />,
    title: "Code Editors",
    description: "The editor supports multiple languages, intelligent autocompletion.",
  },
];

export const inputTypes = [
  {
    icon: <FileText className="w-10 h-10 text-blue-400" />,
    title: "PDF Documents",
    description: "Research papers, reports, manuals, books",
    details: [
      "Supports multi-page PDFs up to 100MB",
      "Extracts text, tables, and structured content",
      "Preserves document hierarchy and sections",
      "Works with scanned PDFs using OCR technology",
    ],
    steps: [
      "Click the 'Upload PDF' button or drag & drop your file",
      "Wait for processing (usually 10-30 seconds)",
      "See confirmation when document is ready",
      "Start asking questions about the content",
    ],
    tips: [
      "Higher quality PDFs give better results",
      "Password-protected PDFs need to be unlocked first",
      "Large documents may take longer to process",
    ],
  },
  {
    icon: <Globe className="w-10 h-10 text-green-400" />,
    title: "Website URLs",
    description: "Articles, blogs, documentation, web pages",
    details: [
      "Scrapes content from any public webpage",
      "Handles dynamic content and JavaScript",
      "Extracts main content while filtering ads/navigation",
      "Supports news articles, blogs, and documentation sites",
    ],
    steps: [
      "Paste the website URL in the input field",
      "Click 'Add Website' to start scraping",
      "System extracts and processes the content",
      "Begin chatting with the webpage content",
    ],
    tips: [
      "Use specific article URLs rather than homepage URLs",
      "Some sites may block automated access",
      "Login-required content cannot be accessed",
    ],
  },
  {
    icon: <Copy className="w-10 h-10 text-purple-400" />,
    title: "Copied Text",
    description: "Emails, notes, articles, any text content",
    details: [
      "Paste any text content directly",
      "Supports formatted text and preserves structure",
      "Ideal for emails, notes, or clipboard content",
      "No file size limits for text input",
    ],
    steps: [
      "Copy your text from any source",
      "Paste it into the text input area",
      "Add a title or description (optional)",
      "Submit to start analyzing the content",
    ],
    tips: [
      "Clean up formatting for better results",
      "Break very long texts into sections",
      "Add context about the text source",
    ],
  },
  {
    icon: <Video className="w-10 h-10 text-red-400" />,
    title: "YouTube Videos",
    description: "Educational content, tutorials, lectures",
    details: [
      "Extracts transcripts from YouTube videos",
      "Works with videos that have captions/subtitles",
      "Supports educational content and tutorials",
      "Processes both auto-generated and manual captions",
    ],
    steps: [
      "Copy the YouTube video URL",
      "Paste it in the YouTube URL field",
      "System downloads and processes transcript",
      "Chat with the video content and key points",
    ],
    tips: [
      "Videos must have available captions",
      "Longer videos may take more time to process",
      "Educational content works best",
    ],
  },
];

export function FooterLink({
  href,
  icon,
  label,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-white transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
}