import { PropsWithChildren, Reducer, useMemo, useReducer } from "react";
import "./App.css";

function Header({
  children,
}: {
  children: (props: {
    menuOpen: boolean;
    toggleMenu: () => void;
  }) => React.ReactNode;
}) {
  const [menuOpen, toggleMenu] = useReducer((state) => !state, false);

  return (
    <header className="header">
      <h1>Header</h1>

      {children({ menuOpen, toggleMenu })}
    </header>
  );
}

function SideMenu() {
  return (
    <aside>
      <h2>Menu</h2>
    </aside>
  );
}

function getInitialWeek(): Date {
  return new Date();
}

type WeekAction = "next" | "prev";

function getWeekInMilliseconds(): number {
  return 7 * 24 * 60 * 60 * 1000;
}

function getNextWeek(week: Date): Date {
  return new Date(week.getTime() + getWeekInMilliseconds());
}

function getPrevWeek(week: Date): Date {
  return new Date(week.getTime() - getWeekInMilliseconds());
}

function useWeek() {
  const [week, dispatchWeekAction] = useReducer<Reducer<Date, WeekAction>>(
    (week, action) => {
      switch (action) {
        case "next":
          return getNextWeek(week);
        case "prev":
          return getPrevWeek(week);

        default:
          return week;
      }
    },
    getInitialWeek()
  );

  const nextWeek = () => dispatchWeekAction("next");

  const prevWeek = () => dispatchWeekAction("prev");

  return { week, nextWeek, prevWeek };
}

// TODO: move to user preference
const WITH_WEEKENDS = true;

function getClosestDayOfWeek(date: Date, dayOfWeek: number) {
  const targetDay = new Date(date);
  targetDay.setDate(date.getDate() + ((dayOfWeek - date.getDay() + 7) % 7));
  return targetDay;
}

// TODO: implement weekends
function getFirstAndLastDayOfWeek(date: Date) {
  const firstDay = getClosestDayOfWeek(date, 1);
  const lastDay = getClosestDayOfWeek(date, 5);

  return { firstDay, lastDay };
}

type WeekHeaderProps = {
  nextWeek: () => void;
  prevWeek: () => void;
  week: Date;
};

function WeekHeader({ nextWeek, prevWeek, week }: WeekHeaderProps) {
  const { firstDay, lastDay } = useMemo(
    () => getFirstAndLastDayOfWeek(week),
    [week]
  );

  return (
    <nav className="week-header">
      <button onClick={prevWeek}>{"<"}</button>

      <h1>
        {firstDay.toDateString()} - {lastDay.toDateString()}
      </h1>

      <button onClick={nextWeek}>{">"}</button>
    </nav>
  );
}

function Container({ children }: PropsWithChildren) {
  return <section className="container">{children}</section>;
}

function getDatesFromRange({ end, start }: { start: Date; end: Date }): Date[] {
  const dates: Date[] = [];
  if (start > end) return dates;

  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

type CognitiveLoadPercentage = {
  date: Date;
  percentage: number;
  title: string;
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function useCognitiveLoadPercentages(day: Date) {
  const cognitiveLoadPercentages: CognitiveLoadPercentage[] = [
    { date: new Date(), percentage: 20, title: "Lorem ipsum" },
  ];

  return {
    cognitiveLoadPercentages: cognitiveLoadPercentages.filter(({ date }) => {
      return isSameDay(date, day);
    }),
  };
}

function Day({ day }: { day: Date }) {
  const { cognitiveLoadPercentages } = useCognitiveLoadPercentages(day);

  return (
    <div className="day__container">
      <h2>{day.toDateString()}</h2>

      <div className="day">
        {cognitiveLoadPercentages.map(({ percentage, title }, index) => (
          <div className="cognitive-load" key={index}>
            <h3>{title}</h3>
            <p>{percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Week({ week, weekends }: { week: Date; weekends: boolean }) {
  const days = useMemo(() => {
    const { firstDay, lastDay } = getFirstAndLastDayOfWeek(week);

    return getDatesFromRange({ start: firstDay, end: lastDay });
  }, [week]);

  return (
    <section className="week">
      {days.map((day) => (
        <Day key={day.toISOString()} day={day} />
      ))}
    </section>
  );
}

function Footer() {
  return <footer>Footer</footer>;
}

function App() {
  const { week, nextWeek, prevWeek } = useWeek();

  return (
    <Container>
      <Header>{({ menuOpen }) => (menuOpen ? <SideMenu /> : null)}</Header>

      <main>
        <WeekHeader nextWeek={nextWeek} prevWeek={prevWeek} week={week} />

        <Week week={week} weekends={WITH_WEEKENDS} />
      </main>

      <Footer />
    </Container>
  );
}

export default App;
