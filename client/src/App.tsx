import { TodoList } from './components/TodoList';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black pointer-events-none" />

      {/* Main Content */}
      <TodoList />
    </div>
  );
}

export default App;
