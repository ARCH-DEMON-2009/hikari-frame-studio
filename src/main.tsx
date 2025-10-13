
import { useAuth } from './contexts/AuthContext';

function DiwaliThemeLoader({ isDiwaliMode }: { isDiwaliMode: boolean }) {
	React.useEffect(() => {
		if (isDiwaliMode) {
			document.body.classList.add('diwali-mode');
			const script = document.createElement('script');
			script.src = '/diwali-theme/diwali-theme.js';
			script.defer = true;
			document.head.appendChild(script);
		} else {
			document.body.classList.remove('diwali-mode');
		}
	}, [isDiwaliMode]);
	return null;
}

const Main = () => {
	const { isAdmin } = useAuth();
	const [isDiwaliMode, setIsDiwaliMode] = React.useState(false);

	// Only show toggle to admin
	return (
		<>
			<DiwaliThemeLoader isDiwaliMode={isDiwaliMode} />
			{isAdmin && (
				<div style={{ position: 'fixed', top: 10, right: 10, zIndex: 2000 }}>
					<label style={{ color: '#6a1b9a', fontWeight: 'bold', background: '#ffd700', padding: '0.5em 1em', borderRadius: '1em', boxShadow: '0 0 8px #ffd70088' }}>
						<input type="checkbox" checked={isDiwaliMode} onChange={e => setIsDiwaliMode(e.target.checked)} />
						{' '}Enable Diwali Theme
					</label>
				</div>
			)}
			<App />
		</>
	);
};

createRoot(document.getElementById("root")!).render(<Main />);
