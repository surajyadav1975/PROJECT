const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { DBConnection } = require("./DB/mongoose");
const { generateFile } = require("./Generatefile");
const { executeFile } = require("./executeFile");
const Prob = require("./models/Prob");
const fs = require("fs");
const path = require("path");
const Submissions = require("./models/Submissions");

dotenv.config();

const app = express();

DBConnection();

const PORT = process.env.PORT || 2000;
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("🔥 compiler is running for the Online Judge");
});

app.post("/submit", async (req, res) => {
  let filepath = "";
  try {
    const { code, language = "cpp", id,userId } = req.body;
    if (!code) return res.status(400).send({ message: "No code provided" });
 
    const problem = await Prob.findById(id);
    if (!problem) return res.status(404).send({ message: "Problem not found" });

    filepath = await generateFile(code, language);

    let results = {};
    for (let i = 0; i < problem.testcases.length; i++) {
      const testCase = problem.testcases[i];

      try {
        const output = await executeFile(filepath, testCase.input);

        const userOutput = output.output.trim();
        const expectedOutput = testCase.output.trim();

        const status = userOutput === expectedOutput ? "accepted" : "rejected";

        results[`Test${i + 1}`] = status;
      } catch (err) {
        results[`Test${i + 1}`] = "rejected";
      }
    }

    const verdict = Object.values(results).includes("rejected")
      ? "Rejected"
      : "Accepted";

    const addedsubmission= await Submissions.create({
      user:userId,
      problem:problem._id,
      code:code,
      verdict,
    })

    res.status(200).json({ success: true, verdict, message: "Code submitted", results });

  } catch (err) {
    res.status(400).json({ success: false, message: "Server error" });
  }
  finally {
    if (filepath) {
    
        setTimeout(async () => {
            try {
                await fs.promises.unlink(filepath);
                console.log('Deleted source file after delay:', filepath);
            } catch (e) {
                console.error('Error deleting file', e);
            }
        }, 100000); 

        setTimeout(async () => {
            try {
                const exePath = filepath.replace('codes', 'outputs').replace('.cpp', '.exe');
                await fs.promises.unlink(exePath);
                console.log('Deleted executable file after delay:', exePath);
            } catch (e) {
                console.error('Error deleting exe', e);
            }
        }, 100000); 
    }
  }
});

app.post("/run", async (req, res) => {
  let filepath=''
  try {
    const { code, language = "cpp", input } = req.body;
    filepath = await generateFile(code, language);
    const output = await executeFile(filepath, input);
    res.status(200).send({ output });
  } catch (err) {
    console.error("Execution failed:", err);
    res.status(400).send(err);
  }
  finally {
    if (filepath) {
        setTimeout(async () => {
            try {
                await fs.promises.unlink(filepath);
                console.log('Deleted source file after delay:', filepath);
            } catch (e) {
                console.error('Error deleting file', e);
            }
        }, 100000);

        setTimeout(async () => {
            try {
                const exePath = filepath.replace('codes', 'outputs').replace('.cpp', '.exe');
                await fs.promises.unlink(exePath);
                console.log('Deleted executable file after delay:', exePath);
            } catch (e) {
                console.error('Error deleting exe', e);
            }
        }, 100000); 
    }
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
