import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from 'chart.js';
import { Pie } from 'react-chartjs-2';
ChartJS.register(ArcElement);
ChartJS.register(Tooltip);
ChartJS.register(Legend);
ChartJS.register(Colors);

const Piechart = ({expenses}) => {
    const chartLabels = expenses.map((expense) => {
        return expense.expenseType;
    })
    const options = {
        plugins: {
          colors: {
            forceOverride: true
          }
        }
      };
    const data = {
        labels: expenses.map((expense) => {
            return expense.charge;
        }),
        datasets: [
          {
            label: 'Expense Distribution',
            data: expenses.map((expense) => {
                return expense.amount;
            }),
          },
        ],
      };

      return (
        <div className='piechart'>
        <Pie data={data} options={options}></Pie>
        </div>
      )
}

export default Piechart;