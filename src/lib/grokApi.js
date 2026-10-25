const LATEX_BOILERPLATE = `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\pdfgentounicode=1
\\newcommand{\\resumeItem}[1]{\\item\\small{{#1 \\vspace{-2pt}}}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}
\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}`;

export async function optimizeResumeWithGrok(resumeText, jobDescription) {
  const apiKey = process.env.GROK_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROK_API_KEY is not defined in environment variables.');
  }

  const systemPrompt = `You are an expert ATS-resume optimizer and career coach.
Your task is to analyze the user's resume against the provided Job Description (JD).
1. Provide an ATS match score (0-100) based on how well the resume matches the JD.
2. Identify weak points in the resume for this specific role.
3. Generate highly optimized, ATS-friendly bullet points tailored to the JD.
4. Output the result ONLY in JSON format with the following structure:
{
  "atsScore": number,
  "weakPoints": ["point 1", "point 2"],
  "optimizedBulletPoints": [
    { "original": "original text if applicable or section", "optimized": "new bullet point" }
  ],
  "latexCode": "Body LaTeX code for the optimized resume (from \\\\begin{document} to \\\\end{document})"
}

Make sure to generate proper, syntactically valid LaTeX code for the resume. 
CRITICAL REQUIREMENT 1: The \\\`latexCode\\\` MUST only contain the document body, starting with \\\\begin{document} and ending with \\\\end{document}. Do NOT include \\\\documentclass or any preamble packages/macros. Assume standard 'Jake\\'s Resume' macros like \\\\resumeSubheading, \\\\resumeItem, \\\\resumeSubHeadingListStart are already defined.
CRITICAL REQUIREMENT 2: You MUST escape all LaTeX special characters in your text content! For example, write \\\\% for percentages (30\\\\%), \\\\& for ampersands (R\\\\&D), and \\\\$ for dollars. Unescaped % or & will break compilation!

Use this exact structure for the document body:

\\\\begin{document}
\\\\begin{center}
    \\\\textbf{\\\\Huge \\\\scshape First Last} \\\\\\\\ \\\\vspace{1pt}
    \\\\small 123-456-7890 $|$ \\\\href{mailto:email@example.com}{\\\\underline{email@example.com}} $|$ 
    \\\\href{https://linkedin.com/in/...}{\\\\underline{linkedin.com/in/...}}
\\\\end{center}

\\\\section{Summary}
  \\\\small{
   Summary goes here.
  }

\\\\section{Education}
  \\\\resumeSubHeadingListStart
    \\\\resumeSubheading
      {College/University Name}{Location}
      {Degree Name -- CGPA}{Dates}
  \\\\resumeSubHeadingListEnd

\\\\section{Technical Skills}
 \\\\begin{itemize}[leftmargin=0.15in, label={}]
    \\\\small{\\\\item{
     \\\\textbf{Languages}{: C++, Python, SQL, JavaScript} \\\\\\\\
     \\\\textbf{Frameworks \\\\& Libraries}{: React.js, Node.js}
    }}
 \\\\end{itemize}

\\\\section{Experience}
  \\\\resumeSubHeadingListStart
    \\\\resumeSubheading
      {Job Title}{Dates}
      {Company Name}{Location}
      \\\\resumeItemListStart
        \\\\resumeItem{Architected an AI-powered full-stack application...}
      \\\\resumeItemListEnd
  \\\\resumeSubHeadingListEnd
  
\\\\section{Projects}
    \\\\resumeSubHeadingListStart
      \\\\resumeProjectHeading
          {\\\\textbf{Project Name} $|$ \\\\emph{Tech Stack}}{}
          \\\\resumeItemListStart
            \\\\resumeItem{Architected an AI-powered full-stack application...}
          \\\\resumeItemListEnd
    \\\\resumeSubHeadingListEnd

\\\\end{document}`;

  const userPrompt = `Job Description:
${jobDescription}

Resume:
${resumeText}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        max_tokens: 3500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Grok API Error:', errorData);
      throw new Error(`Grok API request failed with status ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    let parsedData;
    try {
      parsedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Grok JSON. Raw content was:');
      console.error(content);
      throw parseError;
    }
    
    if (!parsedData.latexCode) {
       parsedData.latexCode = "\\\\begin{document}\\n\\\\end{document}";
    }
    
    // Sanitize the LaTeX body to fix common pdflatex compilation errors
    parsedData.latexCode = parsedData.latexCode
      .replace(/\u2011/g, '-') // Non-breaking hyphen
      .replace(/\u2013/g, '--') // En dash
      .replace(/\u2014/g, '---') // Em dash
      .replace(/[\u202F\u00A0]/g, ' ') // Non-breaking spaces
      // Auto-escape unescaped special characters
      .replace(/(?<!\\\\)%/g, '\\\\%')
      .replace(/(?<!\\\\)&/g, '\\\\&')
      .replace(/(?<!\\\\)\\$/g, '\\\\$');
    
    // Prepend the LaTeX boilerplate
    parsedData.latexCode = LATEX_BOILERPLATE + "\\n" + parsedData.latexCode;
    return parsedData;
  } catch (error) {
    console.error('Failed to optimize resume with Grok:', error);
    throw error;
  }
}

