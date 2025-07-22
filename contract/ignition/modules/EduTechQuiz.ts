import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EduTechQuizModule = buildModule("EduTechQuizModule", (m) => {
 
  const trustees =["", "", "", "",]
 


  const quiz = m.contract("EduTechQuiz", [trustees]);

  return { quiz };
});

export default EduTechQuizModule;
