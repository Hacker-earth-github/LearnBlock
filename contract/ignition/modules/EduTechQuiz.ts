import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EduTechQuizModule = buildModule("EduTechQuizModule", (m) => {
 
  const trustees =["0x0B1Ed827bd0A9a7DF3ae5D58d541AFdB73Fc2D27", "0x82A326C204e0592457921B60cA2FB1Ec8e340c72", "0x6db691950c09b2025855b3166d14ebaf1f6e8ba9", "0x577eE4c12F0943DB8E7E08D324db068d03EE0B36",]
 


  const quiz = m.contract("EduTechQuiz", [trustees]);

  return { quiz };
});

export default EduTechQuizModule;
