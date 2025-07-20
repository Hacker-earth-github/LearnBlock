import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EduTechQuizModule = buildModule("EduTechQuizModule", (m) => {
 
  const trustees =["0x577eE4c12F0943DB8E7E08D324db068d03EE0B36"]
 


  const quiz = m.contract("EduTechQuiz", [trustees]);

  return { quiz };
});

export default EduTechQuizModule;
