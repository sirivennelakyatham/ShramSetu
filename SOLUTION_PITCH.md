# ShramSetu
### Breaking language barriers. Connecting workers to their rights and support.

**The problem we are solving**

Imagine a Bengali construction worker who moves to Hyderabad in search of work. He may understand very little Telugu or English. If his contractor withholds his wages, makes unfair deductions, provides unsafe working conditions, or dismisses him without proper payment, he may not know whether his rights have been violated, which authority handles the issue, what documents he needs, or how to raise a complaint.

For many migrant and manual workers, the difficulty is not just experiencing a workplace problem. It is knowing what to do next and being able to access help in a language they understand.

This is a significant challenge in India. NITI Aayog's analysis of PLFS 2023–24 estimates that nearly **550 million of India's 634 million employed people (87%) were informally employed**. Government Census 2011 data recorded approximately **41.4 million inter-state migrant workers**.

**Our solution: ShramSetu**

ShramSetu is a multilingual worker-support platform initially designed for Telangana, with a focus on Hyderabad. It helps workers understand their rights, explain workplace problems, prepare structured complaints, discover relevant government complaint pathways, and connect with worker-support organisations.

The platform currently supports **six languages: Bengali, Telugu, Hindi, Tamil, Kannada, and English.** Its simple, guided interface is designed for people who may have limited digital experience. Workers should not need to understand complicated legal terminology or navigate multiple websites just to discover where to seek help.

**What makes ShramSetu useful?**

- **AI-assisted complaint preparation:** Workers describe their problems in their own words. Gemini helps ask relevant follow-up questions and prepares a structured report for the worker to review.
- **Voice accessibility:** Gnani Prisma converts spoken descriptions into text, helping workers who find typing difficult. Gnani Timbre converts written guidance into speech, making information easier to access.
- **Government complaint guidance:** ShramSetu includes curated pathways and portal-specific guidance for services such as SAMADHAN, CPGRAMS, Telangana Labour Department and other relevant authorities. Rather than merely giving a portal link, it helps workers understand where to go and what steps to follow.
- **Beyond wage complaints:** While services such as SAMADHAN provide important mechanisms for statutory labour claims and industrial disputes, ShramSetu aims to cover a broader range of workplace and worker-support concerns, helping users identify the appropriate authority or support channel.
- **NGO and support organisation discovery:** We have gone beyond government portals by incorporating relevant NGOs and worker-support organisations. The prototype includes a demonstration request workflow for seeking assistance and viewing simulated replies.
- **Information Hub:** Workers can explore information about their rights, available support, and practical essentials when moving to Hyderabad.

**How ShramSetu works**

- **Describe a problem: Workers explain their workplace issue through text or voice in their preferred language.**

- **AI-assisted complaint preparation: The platform asks relevant follow-up questions and generates a structured complaint report for the worker to review.**

- **Government complaint guidance: ShramSetu identifies relevant grievance pathways and provides curated, portal-specific instructions to help workers submit complaints themselves.**

- **NGO and support organisation outreach: Workers can discover relevant NGOs and support organisations and prepare help-request emails to contact them. ShramSetu also demonstrates a request-tracking workflow, allowing workers to view their submitted requests and follow their status, including responses. In the current prototype, email delivery and replies are simulated locally; real NGO email delivery and reply tracking are planned for a future integration.**

- **Information Hub: Workers can access information about labour rights, available help and practical guidance for people new to Hyderabad.**
- 
**Technology and design decisions**

**Current limitations and responsible next steps**

ShramSetu currently guides workers through official complaint procedures; it does not directly submit complaints to government authorities. Government portals use security controls, identity verification and OTP-based processes, and we do not have the official APIs, authorisation or institutional partnerships required to submit complaints on a worker's behalf. We believe any future automation must be secure, transparent and explicitly consent-based. Our long-term goal is to work with relevant government departments and authorised partners to enable permitted integrations.

The NGO request workflow is also currently a local demonstration, not a live service connected to real NGOs.

**Our future vision**

We aim to expand ShramSetu beyond Hyderabad and Telangana, add more Indian languages and regional complaint pathways, establish partnerships with government departments and NGOs, enable secure document handling and consent-based integrations, and introduce real support-request delivery and response tracking. We also envision low-bandwidth access and additional ways for workers to receive guidance.

**ShramSetu is built around one simple belief: a worker's ability to seek help should never depend on the language they speak or how familiar they are with technology.**
