interface Props {
  data: {
    k: string;
    v: string;
  }[];
}
export default function ViewBox({ data }: Props) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {data.map((item) => (
        <div key={item.k}>
          <div className="flex gap-2.5 bg-app-background py-3 ps-3 min-w-3/5 shadow-lg rounded-md">
            <h3 className="text-app-primary font-bold">{`${item.k}: `} </h3>
            <p className="text-lg font-bold">{item.v}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
