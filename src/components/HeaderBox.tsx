type HeaderBoxProps = {
  type?: 'title' | 'greeting';
  title: string;
  subtext: string;
  name?: string;
};

export default function HeaderBox({
  title,
  name,
  subtext,
  type = 'title',
}: HeaderBoxProps): JSX.Element {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900">
        {title}
        {type === 'greeting' && (
          <>
            ,&nbsp;<span className="text-bankGradient">{name}</span>
          </>
        )}
      </h1>
      <p className="text-sm lg:text-base font-normal text-gray-600">
        {subtext}
      </p>
    </div>
  );
}
