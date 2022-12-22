interface IProps {
  options: Array<string>;
  value: string;
  onChange: (arg: { value: string }) => void;
  className?: string;
}

jest.mock(
  "react-dropdown",
  () =>
    ({ options, value, onChange, className }: IProps) => {
      function handleChange(event: React.FormEvent<HTMLSelectElement>) {
        const option = options.find(
          (option) => option === event.currentTarget.value
        );
        onChange({ value: option! });
      }

      return (
        <select data-testid={className} value={value} onChange={handleChange}>
          {options.map((value, index) => (
            <option key={index} data-testid={index} value={value}>
              {value}
            </option>
          ))}
        </select>
      );
    }
);
