import Login from './(cpnotrouted)/login'
import HomePage from './(cpnotrouted)/HomePage/page';
export default function Home() {
  return (
    <main >
      
          {/* <Login/> */}
          <HomePage searchParams={{
        q: undefined,
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined
      }}/>

    </main>
  );
}
