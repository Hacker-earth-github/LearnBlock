// Footer.jsx
import React from "react"

import { Twitter, Github, Disc as Discord, MessageSquareText as Telegram } from "lucide-react"

const Footer = () => {
  return (
    <footer className="py-16 px-4 border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">LearnBlock</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              Empowering the next generation of blockchain developers and enthusiasts through gamified learning and
              community rewards.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Discord className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Github className="w-6 h-6" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Telegram className="w-6 h-6" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Rewards
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} LearnBlock. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0">Built on Ethereum • Powered by Web3</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
