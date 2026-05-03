import { 
  GapDecomposerAgent, 
  VerificationCourtAgent,
  MockLLMProvider,
  EventBus,
  SemanticStateEngineAgent
} from '../../src';
import { IFEBuilderAgent } from '../../../registry/src/ife_builder';

describe('INTENT E2E Pipeline', () => {
  let eventBus: EventBus;
  let llm: MockLLMProvider;

  beforeEach(() => {
    eventBus = new EventBus({ redisUrl: 'redis://localhost:6379' });
    llm = new MockLLMProvider();
  });

  test('intent declared → FIS created → gap detected', async () => {
    const ife = new IFEBuilderAgent(llm as any, { checkConflicts: async () => ({ conflicts: [], suggestions: [], safe_to_register: true }) } as any, eventBus);
    
    // 1. Declare intent
    const fis = await ife.registerIntent('Zero P1 bugs in production');
    expect(fis.id).toBeTruthy();
    expect(fis.criteria.length).toBeGreaterThan(0);

    // 2. Simulate observation (3 P1 bugs detected)
    const stateEngine = new SemanticStateEngineAgent({ getActiveIntents: async () => [fis] } as any, eventBus);
    
    // We mock the emit to capture it or just verify logic
    const emitSpy = jest.spyOn(eventBus, 'emit');
    
    await stateEngine.onObservation({
      type: 'tickets',
      source: 'jira',
      value: 3,
      timestamp: new Date(),
      metadata: {}
    });

    // Verify intent.gap.detected was emitted
    expect(emitSpy).toHaveBeenCalledWith('intent.gap.detected', expect.objectContaining({
      intentId: fis.id,
      gapScore: expect.any(Number)
    }));
  });

  test('gap detected → missions decomposed', async () => {
    const decomposer = new GapDecomposerAgent(llm as any, eventBus);
    const emitSpy = jest.spyOn(eventBus, 'emit');

    const gap = {
      intentId: 'test-intent-1',
      criterionId: 'crit-1',
      currentValue: 3,
      targetValue: 0,
      gapScore: 1.0,
      timestamp: new Date()
    };

    await decomposer.onGapDetected(gap as any);

    expect(emitSpy).toHaveBeenCalledWith('mission.dag.created', expect.objectContaining({
      gapId: gap.intentId,
      dag: expect.any(Object)
    }));
  });

  test('VC verdict: gap closed → SATISFIED', async () => {
    const vc = new VerificationCourtAgent(eventBus, {} as any, async () => ({}) as any);
    const emitSpy = jest.spyOn(eventBus, 'emit');

    const result = await vc.evaluateAction('action-1', 'intent-1');

    expect(result.verdict).toBe('SATISFIED');
    expect(emitSpy).toHaveBeenCalledWith('intent.verdict.issued', expect.objectContaining({
      verdict: 'SATISFIED'
    }));
  });
});
