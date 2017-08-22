export class Image {

  constructor(
    public id: number,
    public created: string,
    public userId: number,
    public fileUrl: string,
    public owner: string,
    public des?: string,
  ) { }

}