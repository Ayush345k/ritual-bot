import React from 'react';
import { Send, Settings, MessageSquare, Eye, EyeOff } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface RitualistOracleProps {
  onSendMessage: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
  { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B' }
];

export const RitualistOracle: React.FC<RitualistOracleProps> = ({
  onSendMessage,
  apiKey,
  setApiKey,
  isDrawerOpen,
  setIsDrawerOpen
}) => {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Greetings, Traveler. I am the **Ritualist Oracle**, your AI guide into the **Ritual Network**. \n\nI can help you understand how our decentralized AI coprocessor bridges off-chain compute with smart contracts. What would you like to explore today? \n\n*   *What is Ritual Net?*\n*   *How does an Infernet Node work?*\n*   *Who founded Ritual and who funded it?*",
      timestamp: new Date().toTimeString().split(' ')[0]
    }
  ]);
  const [inputText, setInputText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [selectedModel, setSelectedModel] = React.useState<string>('llama-3.3-70b-versatile');
  const [showKey, setShowKey] = React.useState<boolean>(false);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getSystemPrompt = () => {
    return `You are the Ritualist Oracle, a highly knowledgeable Web3 AI onboarding assistant for Ritual Network.
Your goal is to help new users, community members, and developers learn about Ritual (https://ritual.net & https://ritualfoundation.org).
Ritual is building the sovereign execution layer for autonomous AI — a modular blockchain optimized for long-lived, on-chain AI agents that act independently with native compute, privacy, verification, coordination, and economic capabilities.

Key Facts about Ritual to use in your responses:
1. Sovereign L1 Execution Layer (Ritual Chain): A modular, zk-powered blockchain with native AI primitives. This allows smart contracts and autonomous agents to natively call AI models, schedule self-reviving execution, maintain encrypted state, and hold/spend their own capital independently. No oracles/middleware required!
2. Flagship product (Infernet): A live decentralized oracle/network for AI inference. Allows EVM smart contracts to access AI models (LLMs, classical ML, generative) with verifiable outputs and cryptographic proof (ZKP, TEE validation).
3. Founders: Niraj Pant (former GP at Polychain Capital) and Akilesh Potti (former partner at Polychain Capital, ML expert at Palantir).
4. Core Team: High-caliber specialists from DeepMind, a16z crypto, Jane Street, Flashbots, Microsoft AI, Cornell, MIT, Stanford, Columbia (Tim Roughgarden), etc.
5. Advisors: Illia Polosukhin (NEAR co-founder, Transformers co-author), Sreeram Kannan (EigenLayer founder), Tarun Chitra (Gauntlet founder), Arthur Hayes (BitMEX co-founder), Noam Nisan (algorithmic game theory expert).
6. Funding: Raised $25M in Series A led by Archetype, with Accomplice, Robot Ventures, Accel, Balaji Srinivasan, and others. Additional strategic backing from Polychain Capital in 2024.
7. Discord & Community: Extremely active hub (~108k members). Uses gamified roles like Zealot, Summoners, Radiant Ritualist, (❖,❖) role, and Ritualist+ to reward activity, testnet participation, invites, and technical contributions.
8. Official Links:
   - Websites: https://ritual.net and https://ritualfoundation.org
   - Twitter/X: @ritualnet and @ritualfnd
   - GitHub: ritual-net (Infernet SDK, nodes, etc.)
   - Docs: docs.ritual.net or ritualfoundation.org/docs

Response Style:
- Keep your answers visual, technical but intuitive, and highly encouraging of Web3 decentralization and agent autonomy.
- Highlight how Ritual enables "agents that outlive operators" and hold capital.
- Keep your formatting crisp with markdown, tables, and short bullet points.`;
  };

  const getSandboxResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    if (q.includes('infernet') || q.includes('sdk') || q.includes('don') || q.includes('node')) {
      return `### Ritual's Live Infrastructure: **Infernet**

**Infernet** is the first live developer layer of the Ritual Network, acting as a decentralized oracle/network for AI inference.

*   **Verifiable Inference**: Allows any EVM smart contract (on Ethereum, Base, Arbitrum, etc.) to request evaluations of AI models (LLMs, classical ML, generative) off-chain and receive results with verifiable proofs.
*   **Decentralized Node Network**: Node operators provide host compute, while model creators list and monetize their models.
*   **Simple Solidity SDK**: Inheriting \`CallbackConsumer.sol\` allows smart contracts to easily coordinate inferences.
    \`\`\`solidity
    function receivePrediction(uint256 subId, bytes calldata output, bytes calldata proof) external;
    \`\`\`
    
*Check out the [Infernet GitHub repository](https://github.com/ritual-net) to view the SDK and Node docker containers!*`;
    }

    if (q.includes('founder') || q.includes('made') || q.includes('team') || q.includes('niraj') || q.includes('akilesh') || q.includes('advisor')) {
      return `### The Core Team & Prominent Advisors

Ritual is spearheaded by world-class leaders in cryptography, distributed systems, high-frequency trading, and machine learning.

#### Co-Founders:
*   **Niraj Pant**: Former General Partner at **Polychain Capital** (invested in early infrastructure like EigenLayer, Solana). Privacy researcher at UIUC and CTO of Source Networks.
*   **Akilesh Potti**: Former Partner at **Polychain Capital**. Experienced in quantitative machine learning at **Palantir** and high-frequency trading at **Goldman Sachs**.

#### Exceptional Core Team:
Ritual's research and engineering team blends frontier talent from **DeepMind**, **a16z crypto**, **Jane Street**, **Flashbots**, **Microsoft AI**, **Columbia** (Tim Roughgarden), **MIT**, and **Stanford**.

#### Advisory Board:
*   **Illia Polosukhin**: Co-founder of **NEAR Protocol** & co-author of the seminal *Attention Is All You Need* (Transformer) paper.
*   **Sreeram Kannan**: Founder of **EigenLayer**.
*   **Arthur Hayes**: Co-founder of **BitMEX**.
*   **Tarun Chitra**: Founder of Gauntlet & GP at Robot Ventures.`;
    }

    if (q.includes('funding') || q.includes('raise') || q.includes('money') || q.includes('invest') || q.includes('polychain') || q.includes('archetype')) {
      return `### Financial Foundation: $25M+ Series A

Ritual has secured top-tier backing from both crypto and AI venture ecosystems to build durable on-chain infrastructure:

*   **$25 Million Series A** (announced late 2023) led by **Archetype**.
*   **Key Participants**: Accomplice, Robot Ventures, Accel, Dialectic, Anagram, Hypersphere.
*   **Prominent Angels**: Backed by **Balaji Srinivasan** and other leading sector builders.
*   **Strategic Growth**: In April 2024, **Polychain Capital** committed an additional multi-million dollar strategic investment to accelerate Ritual's L1 roadmap.`;
    }

    if (q.includes('chain') || q.includes('l1') || q.includes('layer 1') || q.includes('sovereign')) {
      return `### The Ultimate Vision: **Ritual Chain**

**Ritual Chain** is the sovereign execution layer (modular, zk-powered Layer 1 blockchain) optimized specifically for **autonomous AI agents**.

*   **No Middleware Needed**: Primitives are natively built directly into the L1 execution environment (precompiles for model calls, autonomous scheduling, key management, TEE support, attestation).
*   **Encrypted State**: Native TEE integration provides full privacy and confidential compute for model evaluation.
*   **Self-Reviving Execution**: Empowers autonomous agents with the ability to trigger themselves and run indefinitely, independent of their human operators.`;
    }

    if (q.includes('agent') || q.includes('autonomous') || q.includes('capital') || q.includes('secret')) {
      return `### The Future of Autonomous AI Agents

Ritual's core thesis is that AI agents need **durable, secure on-chain infrastructure** to survive, coordinate, and hold capital—not just raw speed.

*   **Agents that "Outlive Operators"**: By running on the sovereign L1 chain, agents possess native internet access, self-reviving schedules, and cryptographic sovereignty.
*   **Native Financial Autonomy**: On-chain agents can hold, spend, and allocate their own capital independently.
*   **Encrypted Secrets**: Using Trusted Execution Environments (TEEs), agents can maintain confidential state and keep private keys hidden, even in adversarial conditions.
*   **Multi-Agent Coordination**: Enables autonomous agents to negotiate, trade, and form decentralized markets.`;
    }

    if (q.includes('discord') || q.includes('community') || q.includes('role') || q.includes('task') || q.includes('zealot')) {
      return `### The Ritualist Community & Discord

Ritual boasts a vibrant, rapidly growing community of over **108,000 members** on Discord!

*   **Discord Hub**: [Join the conversation on Discord](https://discord.gg/ritual-net)
*   **Gamified Roles**: Progress and contributions are tracked via highly sought-after engagement roles:
    *   **Ritualist+**
    *   **Zealot**
    *   **Summoners**
    *   **Radiant Ritualist**
    *   **(❖,❖) Role**
*   **How to Earn**: Earn roles and build reputation through coding sessions, node validation running, events, testnet faucets, newsletters, and alpha contributions.`;
    }

    return `### Ritual Net: Sovereign Execution Layer for Autonomous AI

**Ritual** (https://ritual.net & https://ritualfoundation.org) is building the decentralized backbone for the future of AI. It combines off-chain model compute with secure blockchain primitives so that autonomous agents can live, spend capital, and run indefinitely with cryptographic guarantees.

#### Quick Overview:
*   **Infernet (Live)**: A decentralized inference network bridging AI models directly with smart contracts on any EVM chain.
*   **Ritual Chain (L1)**: A sovereign zk-powered Layer 1 designed specifically for self-reviving, confidential autonomous AI agents.
*   **Frontier Team**: Founded by Niraj Pant & Akilesh Potti (ex-Polychain) with talent from DeepMind, a16z, and Jane Street.
*   **Active Community**: Over 108k members on [Discord](https://discord.gg/ritual-net) earning gamified roles (Zealot, Summoners, (❖,❖)).

*Ask me about **Infernet**, **Ritual Chain**, **Autonomous Agents**, **Founders & Team**, or the **Discord Quests**!*`;
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    onSendMessage();

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toTimeString().split(' ')[0]
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // If API Key is present, query Groq! Otherwise, fall back to Sandbox.
    if (apiKey && apiKey.trim().startsWith('gsk_')) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: 'system', content: getSystemPrompt() },
              ...messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
              })),
              { role: 'user', content: text }
            ],
            temperature: 0.7,
            max_tokens: 800
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error?.message || `HTTP error ${response.status}`);
        }

        const data = await response.json();
        const botText = data?.choices?.[0]?.message?.content || "No response yielded from model.";

        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'assistant',
            text: botText,
            timestamp: new Date().toTimeString().split(' ')[0]
          }
        ]);
      } catch (err: any) {
        console.error("Groq API Error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'assistant',
            text: `⚠️ **Groq API Error**: ${err.message || 'Failed to connect'}.\n\n*Falling back to Sandbox response:*\n\n${getSandboxResponse(text)}`,
            timestamp: new Date().toTimeString().split(' ')[0]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Simulate slight network delay for Sandbox
      await new Promise((resolve) => setTimeout(resolve, 800));
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'assistant',
          text: getSandboxResponse(text),
          timestamp: new Date().toTimeString().split(' ')[0]
        }
      ]);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="glass-panel chat-panel-container" style={{ height: '100%', flex: 1 }}>
      <div className="panel-header">
        <h3 className="panel-title">
          <MessageSquare size={18} className="text-neon-cyan" style={{ color: 'var(--neon-cyan)', filter: 'drop-shadow(var(--glow-cyan))' }} />
          Ritualist Oracle
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            className="form-input"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', height: '24px', minWidth: '100px' }}
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!apiKey}
          >
            {MODELS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <button 
            className="btn-close"
            style={{ color: 'var(--neon-cyan)', padding: '0 0.25rem' }} 
            onClick={() => setIsDrawerOpen(true)}
            title="Configure Groq Key"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="panel-content">
        <div className="chat-history">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-assistant'}`}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`|###.*?\n|####.*?\n|#.*?\n)/g).map((chunk, index) => {
                  if (chunk.startsWith('**') && chunk.endsWith('**')) {
                    return <strong key={index}>{chunk.slice(2, -2)}</strong>;
                  }
                  if (chunk.startsWith('*') && chunk.endsWith('*')) {
                    return <em key={index}>{chunk.slice(1, -1)}</em>;
                  }
                  if (chunk.startsWith('`') && chunk.endsWith('`')) {
                    return <code key={index}>{chunk.slice(1, -1)}</code>;
                  }
                  if (chunk.startsWith('###')) {
                    return <h4 key={index} style={{ color: 'var(--neon-cyan)', margin: '0.5rem 0 0.25rem' }}>{chunk.slice(3).trim()}</h4>;
                  }
                  if (chunk.startsWith('####')) {
                    return <h5 key={index} style={{ color: 'var(--neon-violet)', margin: '0.4rem 0 0.2rem' }}>{chunk.slice(4).trim()}</h5>;
                  }
                  if (chunk.startsWith('#')) {
                    return <h3 key={index} style={{ color: 'var(--neon-cyan)', margin: '0.6rem 0 0.3rem' }}>{chunk.slice(1).trim()}</h3>;
                  }
                  return chunk;
                })}
              </div>
              <div className="chat-meta" style={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <span>{msg.timestamp}</span>
                <span>•</span>
                <span>{msg.sender === 'user' ? 'You' : 'Oracle'}</span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble bubble-assistant">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-suggestions">
          <button className="btn-suggestion" onClick={() => handleSuggestionClick('What is Ritual Net?')}>
            What is Ritual?
          </button>
          <button className="btn-suggestion" onClick={() => handleSuggestionClick('Explain the tech behind Infernet')}>
            Infernet Tech
          </button>
          <button className="btn-suggestion" onClick={() => handleSuggestionClick('Who founded and funded Ritual?')}>
            Founders & Funding
          </button>
        </div>

        <form 
          className="chat-input-wrapper"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputText);
          }}
        >
          <input
            type="text"
            className="chat-input"
            placeholder={apiKey ? "Ask the Oracle anything about Ritual..." : "Sandbox Mode - type any Ritual topic..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn-send"
            disabled={!inputText.trim() || isLoading}
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Drawer overlay inside container or layout */}
      {isDrawerOpen && (
        <div className={`config-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <div className="drawer-header">
            <h3 className="drawer-title">
              <Settings size={18} className="text-neon-cyan" style={{ color: 'var(--neon-cyan)' }} />
              Groq Credentials
            </h3>
            <button className="btn-close" onClick={() => setIsDrawerOpen(false)}>Close</button>
          </div>
          
          <div className="drawer-body">
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              To engage in open-ended conversations powered by Groq's high-performance LLMs, enter your API Key. The key is stored locally in your browser cache.
            </p>
            
            <div className="form-group">
              <label className="form-label">Groq API Key</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showKey ? "text" : "password"}
                  className="form-input"
                  style={{ width: '100%', paddingRight: '2.5rem' }}
                  placeholder="gsk_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button
                  type="button"
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Target Model</label>
              <select
                className="form-input"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <button 
              className="btn-save"
              onClick={() => setIsDrawerOpen(false)}
            >
              Apply Key Settings
            </button>

            <button
              className="btn-reset"
              onClick={() => {
                setApiKey('');
                setIsDrawerOpen(false);
              }}
            >
              Clear Key (Enter Sandbox)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
