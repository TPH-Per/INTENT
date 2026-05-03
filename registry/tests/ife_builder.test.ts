import { FIS, EventBus, MockLLMProvider } from '@intent/core';
import { IFEBuilderAgent } from '../src/ife_builder';
import { ConflictDetectorAgent } from '../src/conflict_detector';
import { FISModel, initModels } from '../src/models';
import { Sequelize } from 'sequelize';

describe('IFEBuilderAgent', () => {
  let agent: IFEBuilderAgent;
  let sequelize: Sequelize;
  let mockEventBus: any;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    initModels(sequelize);
    await sequelize.sync();
  });

  beforeEach(() => {
    mockEventBus = { emit: jest.fn().mockResolvedValue('123') };
    const llm = new MockLLMProvider();
    const conflictDetector = new ConflictDetectorAgent('mock-url');
    agent = new IFEBuilderAgent(llm, conflictDetector, mockEventBus);
  });

  it('should register an intent and emit an event', async () => {
    const nl = "Ensure no P1 bugs in auth service";
    const fis = await agent.registerIntent(nl);

    expect(fis.statement_nl).toBe(nl);
    expect(mockEventBus.emit).toHaveBeenCalledWith('intent.registered', expect.any(Object));
    
    const count = await FISModel.count();
    expect(count).toBe(1);
  });
});
