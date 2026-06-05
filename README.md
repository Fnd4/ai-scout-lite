# AI Scout Lite

AI Scout Lite is a Gemini-powered web app that helps beginners decide whether an AI tool, startup idea, or GitHub project is actually worth their time.

Users paste a project description or README-style text, and AI Scout generates a structured scout report with a summary, target users, weaknesses, category scores, a total Scout Score, and a TRY / WATCH / SKIP verdict.

## Live Demo

https://aiscoutlite.netlify.app

## GitHub Repository

https://github.com/Fnd4/ai-scout-lite

## What it does

AI Scout Lite helps students, beginner developers, indie hackers, and hackathon builders evaluate projects before wasting time on overhyped or poorly scoped ideas.

The app analyzes a pasted project description and returns:

* Short summary
* Who the project helps
* Main weaknesses
* Usefulness score
* Originality score
* Technical potential score
* Beginner value score
* Total Scout Score from 0 to 100
* Final verdict: TRY, WATCH, or SKIP
* Recommended next step

## Why I built it

There are too many AI tools, startup ideas, and GitHub projects competing for attention. Beginners often do not know which projects are actually useful, realistic, or worth learning from.

AI Scout Lite acts as a quick decision-making layer. It does not just summarize an idea — it helps the user decide whether the project is worth their time.

## How it works

1. The user pastes an AI tool, startup idea, or GitHub project description.
2. The frontend sends the text to a Netlify Function.
3. The Netlify Function securely calls the Gemini API.
4. Gemini returns a structured JSON analysis.
5. The frontend displays the result as a clean scout report.

## Tech Stack

* HTML
* CSS
* JavaScript
* Netlify Functions
* Gemini API
* GitHub
* Netlify

## Key Features

* Gemini-powered project analysis
* Structured scoring system
* TRY / WATCH / SKIP verdict
* Beginner-focused evaluation
* Clean dark “intelligence briefing” style UI
* Serverless API key protection through Netlify Functions
* Demo fallback mode if the API fails

## Hackathon Context

This project was built as a focused hackathon MVP.

I intentionally used a zero-dependency frontend instead of a large framework so the project stays simple, fast, and easy to deploy. The Gemini API key is not exposed in the browser. Instead, the frontend calls a Netlify Function, which acts as a secure serverless proxy between the app and Gemini.

The goal was not to build a giant platform, but to ship a working product with a clear use case: helping beginners evaluate projects before they waste time on hype.

## Future Improvements

Future versions could include:

* Direct GitHub README analysis from repository URLs
* Repository activity and documentation checks
* Saved scout reports
* Project comparison mode
* Browser extension support
* Daily curated AI project recommendations
* Exportable reports
* More advanced scoring based on real project metadata

## Local Setup

Clone the repository:

```bash
git clone https://github.com/Fnd4/ai-scout-lite.git
cd ai-scout-lite
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Run locally with Netlify:

```bash
npm run dev
```

## Built for

Evorozen Innovators Hackathon
