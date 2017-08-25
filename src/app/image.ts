export class Image {

  constructor(
    public id: number,
    public created: string,  // set by back end
    public userId: number,
    public fileUrl: string,
    public owner: string,
    public des?: string,
    public localImage?: File,
  ) { }

}